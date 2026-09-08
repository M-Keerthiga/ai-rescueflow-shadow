/**
 * AI RESCUEFLOW SHADOW — Phase E Test Suite
 * Master Demo Integration, Multi-Mode Execution, Severity Matrix, and Startup Verification.
 *
 * SIMULATION ONLY — NO REAL EMERGENCY SERVICES CONTACTED
 */

import http from 'http';
import express from 'express';
import { masterDemoController } from './services/masterDemoController.js';
import apiRouter from './routes/api.js';
import { db } from './database.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

async function runTestSuite() {
  console.log('===============================================================');
  console.log('AI RESCUEFLOW SHADOW — PHASE E TEST SUITE');
  console.log('SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED');
  console.log('===============================================================\n');

  // --- 1. PREVENTION PATH EXECUTION ---
  console.log('--- TEST SUITE 1: Prevention Path Verification ---');
  const prevResult = masterDemoController.runScenario('prevention');
  assert(prevResult.mode === 'prevention', 'Prevention scenario mode is prevention');
  assert(prevResult.status === 'COMPLETED', 'Prevention scenario status is COMPLETED');
  assert(prevResult.preventionResult.collisionAvoided === true, 'Collision avoided is true');
  assert(prevResult.preventionResult.riskReduced === true, 'Risk reduced is true');
  assert(prevResult.preventionResult.preventionSuccessful === true, 'Prevention successful is true');
  assert(prevResult.preventionResult.noEmergencyNotificationsRequired === true, 'No emergency notifications required');
  assert(prevResult.preventionResult.orchestratorActive === false, 'Emergency Orchestrator remains INACTIVE');
  assert(prevResult.metrics.totalNotificationsGenerated === 0, 'Total notifications generated is 0 for prevention');
  assert(prevResult.metrics.timelineCompletionPercent === 100, 'Timeline completion is 100%');
  assert(prevResult.simulationDisclaimer === 'SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED', 'Mandatory simulation disclaimer present');

  // --- 2. COLLISION PATH & SEVERITY MATRIX VERIFICATION ---
  console.log('\n--- TEST SUITE 2: Automatic Severity Showcase & Policy Routing ---');
  
  // LOW
  const lowResult = masterDemoController.runScenario('collision', 'LOW');
  assert(lowResult.severity === 'LOW', 'LOW severity executed');
  assert(lowResult.recipientSummary.FAMILY > 0, 'LOW notifies Family');
  assert(lowResult.recipientSummary.HOSPITAL === 0, 'LOW does NOT notify Hospital');
  assert(lowResult.recipientSummary.POLICE === 0, 'LOW does NOT notify Police');
  assert(lowResult.channelSummary.TOTAL === 12, 'LOW generates 12 notifications (3 family x 4 channels)');

  // MODERATE
  const modResult = masterDemoController.runScenario('collision', 'MODERATE');
  assert(modResult.severity === 'MODERATE', 'MODERATE severity executed');
  assert(modResult.recipientSummary.FAMILY > 0, 'MODERATE notifies Family');
  assert(modResult.recipientSummary.HOSPITAL > 0, 'MODERATE notifies Hospital');
  assert(modResult.recipientSummary.POLICE === 0, 'MODERATE does NOT notify Police');
  assert(modResult.channelSummary.TOTAL === 16, 'MODERATE generates 16 notifications');

  // HIGH
  const highResult = masterDemoController.runScenario('collision', 'HIGH');
  assert(highResult.severity === 'HIGH', 'HIGH severity executed');
  assert(highResult.recipientSummary.FAMILY > 0, 'HIGH notifies Family');
  assert(highResult.recipientSummary.HOSPITAL > 0, 'HIGH notifies Hospital');
  assert(highResult.recipientSummary.POLICE > 0, 'HIGH notifies Police');
  assert(highResult.channelSummary.TOTAL === 20, 'HIGH generates 20 notifications');

  // CRITICAL
  const critResult = masterDemoController.runScenario('collision', 'CRITICAL');
  assert(critResult.severity === 'CRITICAL', 'CRITICAL severity executed');
  assert(critResult.responsePriority === 'Highest Priority', 'CRITICAL priority is Highest Priority');
  assert(critResult.recipientSummary.FAMILY > 0 && critResult.recipientSummary.HOSPITAL > 0 && critResult.recipientSummary.POLICE > 0, 'CRITICAL notifies Family, Hospital, and Police');
  assert(critResult.channelSummary.TOTAL === 20, 'CRITICAL generates 20 notifications');

  // CATASTROPHIC
  const catResult = masterDemoController.runScenario('collision', 'CATASTROPHIC');
  assert(catResult.severity === 'CATASTROPHIC', 'CATASTROPHIC severity executed');
  assert(catResult.responsePriority === 'Immediate Highest Priority', 'CATASTROPHIC priority is Immediate Highest Priority');
  assert(catResult.recipientSummary.FAMILY > 0 && catResult.recipientSummary.HOSPITAL > 0 && catResult.recipientSummary.POLICE > 0, 'CATASTROPHIC notifies Family, Hospital, and Police');
  assert(catResult.channelSummary.TOTAL === 20, 'CATASTROPHIC generates 20 notifications');

  // --- 3. FULL SHOWCASE SEQUENCE ---
  console.log('\n--- TEST SUITE 3: Full Showcase Sequence Execution ---');
  const showcaseResult = masterDemoController.runShowcase();
  assert(showcaseResult.mode === 'FULL_SHOWCASE', 'Showcase mode is FULL_SHOWCASE');
  assert(showcaseResult.totalScenarios === 6, 'Showcase contains all 6 stages (Prevention + 5 Severities)');
  assert(showcaseResult.scenarios[0].mode === 'prevention', 'Stage 1 is prevention');
  assert(showcaseResult.scenarios[1].severity === 'LOW', 'Stage 2 is LOW');
  assert(showcaseResult.scenarios[2].severity === 'MODERATE', 'Stage 3 is MODERATE');
  assert(showcaseResult.scenarios[3].severity === 'HIGH', 'Stage 4 is HIGH');
  assert(showcaseResult.scenarios[4].severity === 'CRITICAL', 'Stage 5 is CRITICAL');
  assert(showcaseResult.scenarios[5].severity === 'CATASTROPHIC', 'Stage 6 is CATASTROPHIC');
  assert(showcaseResult.matrix.LOW.channelCount === 12, 'Matrix defines LOW channel count');
  assert(showcaseResult.matrix.CATASTROPHIC.priority === 'Immediate Highest Priority', 'Matrix defines CATASTROPHIC priority');

  // --- 4. PERFORMANCE METRICS INSTRUMENTATION ---
  console.log('\n--- TEST SUITE 4: Performance Metrics Instrumentation ---');
  const metrics = critResult.metrics;
  assert(typeof metrics.totalDemoDurationMs === 'number', 'Total demo duration captured');
  assert(typeof metrics.collisionProcessingTimeMs === 'number', 'Collision processing time captured');
  assert(typeof metrics.severityCalculationTimeMs === 'number', 'Severity calculation time captured');
  assert(typeof metrics.locationResolutionTimeMs === 'number', 'Location resolution time captured');
  assert(typeof metrics.notificationGenerationTimeMs === 'number', 'Notification generation time captured');
  assert(typeof metrics.dispatchPlanningTimeMs === 'number', 'Dispatch planning time captured');
  assert(typeof metrics.blackboxGenerationTimeMs === 'number', 'Blackbox generation time captured');
  assert(metrics.totalNotificationsGenerated === 20, 'Total notifications generated metric matches output');
  assert(metrics.timelineCompletionPercent === 100, 'Timeline completion percent is 100%');

  // --- 5. LIVE APPLICATION STARTUP & API VERIFICATION ---
  console.log('\n--- TEST SUITE 5: Application Startup & REST APIs Verification ---');
  const app = express();
  app.use(express.json());
  app.use('/api', apiRouter);

  const testPort = 5099;
  const server = http.createServer(app);

  await new Promise((resolve) => server.listen(testPort, resolve));

  const apiGet = (path) =>
    new Promise((resolve, reject) => {
      http.get(`http://localhost:${testPort}${path}`, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
        res.on('error', reject);
      });
    });

  const apiPost = (path, body) =>
    new Promise((resolve, reject) => {
      const payload = JSON.stringify(body);
      const req = http.request(
        `http://localhost:${testPort}${path}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
          }
        },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
          res.on('error', reject);
        }
      );
      req.on('error', reject);
      req.write(payload);
      req.end();
    });

  try {
    // 5.1 Emergency Services API HTTP 200
    const servicesRes = await apiGet('/api/emergency/services');
    assert(servicesRes.status === 200, 'GET /api/emergency/services returns HTTP 200');

    // 5.2 Master Demo Status HTTP 200
    const statusRes = await apiGet('/api/master-demo/status');
    assert(statusRes.status === 200, 'GET /api/master-demo/status returns HTTP 200');

    // 5.3 Master Demo Metrics HTTP 200
    const metricsRes = await apiGet('/api/master-demo/metrics');
    assert(metricsRes.status === 200, 'GET /api/master-demo/metrics returns HTTP 200');

    // 5.4 Master Demo Speed Setting HTTP 200
    const speedRes = await apiPost('/api/master-demo/speed', { speed: 2.0 });
    assert(speedRes.status === 200, 'POST /api/master-demo/speed returns HTTP 200');
    assert(speedRes.body.playbackSpeed === 2.0, 'Playback speed updated to 2.0x');

    // 5.5 Master Demo Run Scenario API HTTP 200 (Prevention)
    const runPrevRes = await apiPost('/api/master-demo/run-scenario', { mode: 'prevention' });
    assert(runPrevRes.status === 200, 'POST /api/master-demo/run-scenario (prevention) returns HTTP 200');
    assert(runPrevRes.body.preventionResult.collisionAvoided === true, 'API returns collision avoided');

    // 5.6 Master Demo Run Scenario API HTTP 200 (Collision Critical)
    const runCritRes = await apiPost('/api/master-demo/run-scenario', { mode: 'collision', severity: 'CRITICAL' });
    assert(runCritRes.status === 200, 'POST /api/master-demo/run-scenario (CRITICAL) returns HTTP 200');
    assert(runCritRes.body.incidentId != null, 'API returns generated incidentId');

    // 5.7 Master Demo Run Showcase API HTTP 200
    const runShowRes = await apiPost('/api/master-demo/run-showcase', {});
    assert(runShowRes.status === 200, 'POST /api/master-demo/run-showcase returns HTTP 200');
    assert(runShowRes.body.totalScenarios === 6, 'Showcase API executes all 6 stages');

  } finally {
    await new Promise((resolve) => server.close(resolve));
    await new Promise((resolve) => db.close(resolve));
  }

  console.log('\n===============================================================');
  console.log(`PHASE E TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('===============================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
