import express from 'express';
import { calculateRisk } from '../services/riskEngine.js';
import { analyzeIncident } from '../services/rescueEngine.js';
import { dbAll, dbGet, dbRun } from '../database.js';
import { masterDemoController } from '../services/masterDemoController.js';
import { emergencyResponseOrchestrator } from '../services/emergencyResponseOrchestrator.js';
import { deduplicationService } from '../services/deduplicationService.js';
import { notificationEngine } from '../services/notificationEngine.js';

const router = express.Router();

// =========================================================================
// MASTER DEMO & 46-TEST VERIFICATION ENDPOINTS
// =========================================================================
router.post('/master-demo/start', (req, res) => {
  res.json(masterDemoController.startDemo());
});

router.post('/master-demo/pause', (req, res) => {
  res.json(masterDemoController.pauseDemo());
});

router.post('/master-demo/resume', (req, res) => {
  res.json(masterDemoController.resumeDemo());
});

router.post('/master-demo/restart', (req, res) => {
  res.json(masterDemoController.restartDemo());
});

router.post('/master-demo/stop', (req, res) => {
  res.json(masterDemoController.stopDemo());
});

router.post('/master-demo/speed', (req, res) => {
  const { speed } = req.body || {};
  res.json(masterDemoController.setPlaybackSpeed(speed));
});

router.post('/master-demo/run-scenario', (req, res) => {
  const { mode, severity, options } = req.body || {};
  res.json(masterDemoController.runScenario(mode, severity, options));
});

router.post('/master-demo/run-showcase', (req, res) => {
  res.json(masterDemoController.runShowcase());
});

router.get('/master-demo/metrics', (req, res) => {
  res.json({
    metrics: masterDemoController.metrics,
    simulationDisclaimer: 'SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED'
  });
});

router.get('/master-demo/status', (req, res) => {
  res.json(masterDemoController.getStatusPayload());
});

router.get('/master-demo/evidence/:testId', (req, res) => {
  const evidence = masterDemoController.getTestEvidence(req.params.testId);
  if (!evidence) return res.status(404).json({ error: 'Test evidence not found' });
  res.json(evidence);
});

// =========================================================================
// VISION SERVICE & RISK ENGINE ENDPOINTS
// =========================================================================
router.get('/vision/status', async (req, res) => {
  try {
    const pythonRes = await fetch('http://localhost:8000/status').catch(() => null);
    if (pythonRes && pythonRes.ok) {
      const data = await pythonRes.json();
      return res.json({
        modelStatus: data.isTrained ? 'TRAINED_MODEL' : 'PRETRAINED_MODEL',
        isTrained: data.isTrained,
        source: 'PYTHON_CV_SERVICE'
      });
    }

    res.json({
      modelStatus: 'DEMO_TELEMETRY',
      isTrained: false,
      source: 'CONTROLLED_DEMO_TELEMETRY'
    });
  } catch (e) {
    res.json({
      modelStatus: 'DEMO_TELEMETRY',
      isTrained: false,
      source: 'FALLBACK'
    });
  }
});

router.post('/vision/telemetry', async (req, res) => {
  try {
    const { timestamp, objects, mode } = req.body;
    if (!objects || !Array.isArray(objects)) {
      return res.status(400).json({ error: 'Invalid telemetry objects array.' });
    }

    const busObj = objects.find((o) => (o.class || '').toLowerCase() === 'bus') || objects[0];
    const carObj = objects.find((o) => (o.class || '').toLowerCase() === 'car') || objects[1];

    const vehicleA = {
      type: `BUS #${busObj?.id || 7}`,
      speed: busObj?.speedKmh || 42,
      distance: busObj?.distanceM || 38,
      heading: busObj?.heading || 12,
      brakingCapability: 'medium',
      reactionTime: 1.2,
      mass: 12000
    };

    const vehicleB = {
      type: `CAR #${carObj?.id || 12}`,
      speed: carObj?.speedKmh || 8,
      distance: carObj?.distanceM || 22,
      heading: carObj?.heading || 184,
      brakingCapability: 'medium',
      reactionTime: 1.0,
      mass: 1400
    };

    const environment = {
      roadCondition: 'wet',
      visibility: 'good',
      trafficDensity: 'moderate',
      trafficSignal: 'yellow'
    };

    const riskResult = calculateRisk(vehicleA, vehicleB, environment);

    res.json({
      status: 'SUCCESS',
      telemetryReceived: objects.length,
      mode: mode || 'VISION_MODEL',
      riskResult
    });
  } catch (error) {
    console.error('Error processing vision telemetry:', error);
    res.status(500).json({ error: 'Failed to process vision telemetry' });
  }
});

router.post('/risk/calculate', async (req, res) => {
  try {
    const { vehicleA, vehicleB, environment } = req.body;

    if (!vehicleA || !vehicleB || !environment) {
      return res.status(400).json({ error: 'Missing required vehicle or environmental parameters.' });
    }

    const riskResult = calculateRisk(vehicleA, vehicleB, environment);

    if (riskResult.category === 'HIGH' || riskResult.category === 'CRITICAL') {
      await dbRun(
        `INSERT INTO alerts (timestamp, risk_score, risk_category, driver_a_action, driver_b_action, ttc)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          new Date().toISOString(),
          riskResult.predictedCollisionRisk,
          riskResult.category,
          riskResult.vehicleA.recommendedAction,
          riskResult.vehicleB.recommendedAction,
          riskResult.estimatedTTC
        ]
      );
    }

    res.json(riskResult);
  } catch (error) {
    console.error('Error calculating risk:', error);
    res.status(500).json({ error: 'Internal risk calculation error' });
  }
});

router.post('/incidents/create', async (req, res) => {
  try {
    const telemetry = req.body;
    const incidentData = analyzeIncident(telemetry);

    await dbRun(
      `INSERT INTO incidents (
        id, timestamp, status, severity_level, severity_score, impact_speed_kmh, g_force_b,
        vehicle_a_json, vehicle_b_json, telemetry_json, dispatches_json, timeline_json, prevention_json, report_json
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        incidentData.incidentId,
        incidentData.timestamp,
        incidentData.status,
        incidentData.severity.level,
        incidentData.severity.score,
        incidentData.impactAnalysis.relativeImpactSpeedKmH,
        incidentData.impactAnalysis.gForceVehicleB,
        JSON.stringify(incidentData.vehiclesInvolved[0]),
        JSON.stringify(incidentData.vehiclesInvolved[1]),
        JSON.stringify(telemetry),
        JSON.stringify(incidentData.dispatches),
        JSON.stringify(incidentData.responseTimeline),
        JSON.stringify(incidentData.preventionInsights),
        JSON.stringify(incidentData)
      ]
    );

    res.json(incidentData);
  } catch (error) {
    console.error('Error creating incident:', error);
    res.status(500).json({ error: 'Failed to record incident in database' });
  }
});

router.get('/incidents', async (req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM incidents ORDER BY timestamp DESC');
    const incidents = rows.map((r) => ({
      id: r.id,
      timestamp: r.timestamp,
      status: r.status,
      severityLevel: r.severity_level,
      severityScore: r.severity_score,
      impactSpeedKmH: r.impact_speed_kmh,
      gForceB: r.g_force_b,
      vehicleA: JSON.parse(r.vehicle_a_json || '{}'),
      vehicleB: JSON.parse(r.vehicle_b_json || '{}'),
      dispatches: JSON.parse(r.dispatches_json || '[]'),
      timeline: JSON.parse(r.timeline_json || '[]'),
      preventionInsights: JSON.parse(r.prevention_json || '[]'),
      report: JSON.parse(r.report_json || '{}')
    }));
    res.json(incidents);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    res.status(500).json({ error: 'Failed to fetch incidents' });
  }
});

router.get('/alerts', async (req, res) => {
  try {
    const alerts = await dbAll('SELECT * FROM alerts ORDER BY id DESC LIMIT 50');
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

router.get('/analytics', async (req, res) => {
  try {
    const incidents = await dbAll('SELECT * FROM incidents');
    const alerts = await dbAll('SELECT * FROM alerts');

    const totalIncidents = incidents.length;
    const totalAlerts = alerts.length;

    const severityMap = { LOW: 0, MODERATE: 0, CRITICAL: 0, CATASTROPHIC: 0 };
    incidents.forEach((i) => {
      severityMap[i.severity_level] = (severityMap[i.severity_level] || 0) + 1;
    });

    const severityChartData = Object.keys(severityMap).map((key) => ({
      name: key,
      count: severityMap[key]
    }));

    const riskCatMap = { SAFE: 0, CAUTION: 0, HIGH: 0, CRITICAL: 0 };
    alerts.forEach((a) => {
      riskCatMap[a.risk_category] = (riskCatMap[a.risk_category] || 0) + 1;
    });

    const riskDistributionData = Object.keys(riskCatMap).map((cat) => ({
      category: cat,
      count: riskCatMap[cat]
    }));

    res.json({
      totalIncidents,
      totalAlerts,
      preventedCollisionsEstimate: totalAlerts * 3 + 14,
      avgDispatchTimeMinutes: 4.2,
      severityChartData,
      riskDistributionData,
      responseTimeData: [
        { month: 'Jan', avgMinutes: 5.4, target: 5.0 },
        { month: 'Feb', avgMinutes: 4.9, target: 5.0 },
        { month: 'Mar', avgMinutes: 4.6, target: 5.0 },
        { month: 'Apr', avgMinutes: 4.2, target: 5.0 }
      ]
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({ error: 'Failed to compute analytics' });
  }
});

// =========================================================================
// EMERGENCY RESPONSE ORCHESTRATOR ENDPOINTS (SIMULATION MODE ONLY)
// =========================================================================
router.post('/orchestrator/dispatch', (req, res) => {
  try {
    const result = emergencyResponseOrchestrator.orchestrateEmergencyResponse(req.body);
    res.json(result);
  } catch (error) {
    console.error('Emergency Response Orchestration error:', error);
    res.status(500).json({
      error: 'Orchestrator internal error',
      simulationDisclaimer: 'SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED'
    });
  }
});

router.get('/orchestrator/history/:incidentId', (req, res) => {
  try {
    const records = deduplicationService.getIncidentRecords(req.params.incidentId);
    res.json({
      incidentId: req.params.incidentId,
      records,
      simulationDisclaimer: 'SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve dispatch history' });
  }
});

// =========================================================================
// PHASE B — NOTIFICATION ENGINE ENDPOINTS (SIMULATION MODE ONLY)
// =========================================================================
router.get('/emergency/services', (req, res) => {
  try {
    const services = notificationEngine.getEmergencyServices();
    res.json(services);
  } catch (error) {
    console.error('Error fetching emergency services:', error);
    res.status(500).json({
      error: 'Failed to retrieve emergency services',
      simulationDisclaimer: 'SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED'
    });
  }
});

router.post('/emergency/orchestrate', (req, res) => {
  try {
    const result = emergencyResponseOrchestrator.orchestrateEmergencyResponse(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error orchestrating emergency response:', error);
    res.status(500).json({
      error: 'Emergency orchestration error',
      simulationDisclaimer: 'SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED'
    });
  }
});

router.post('/emergency/notify', (req, res) => {
  try {
    const result = notificationEngine.notify(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error executing notification dispatch:', error);
    res.status(500).json({
      error: 'Notification engine error',
      simulationDisclaimer: 'SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED'
    });
  }
});

router.get('/emergency/status/:incidentId', (req, res) => {
  try {
    const status = notificationEngine.getStatus(req.params.incidentId);
    res.json(status);
  } catch (error) {
    console.error('Error fetching emergency status:', error);
    res.status(500).json({
      error: 'Failed to retrieve emergency notification status',
      simulationDisclaimer: 'SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED'
    });
  }
});

router.get('/emergency/history', (req, res) => {
  try {
    const history = notificationEngine.getHistory();
    res.json(history);
  } catch (error) {
    console.error('Error fetching emergency history:', error);
    res.status(500).json({
      error: 'Failed to retrieve emergency notification history',
      simulationDisclaimer: 'SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED'
    });
  }
});

export default router;
