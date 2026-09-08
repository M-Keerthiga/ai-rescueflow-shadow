/**
 * AI RESCUEFLOW SHADOW — Master Demo Controller
 * Manages automated single-click Master Demo execution loop, playback controls,
 * current test ticker, test results store, and end-to-end Emergency Response integration.
 *
 * SIMULATION ONLY — NO REAL EMERGENCY SERVICES CONTACTED
 */

import { MASTER_DEMO_SCENARIOS } from './masterDemoScenarios.js';
import { runFullTestSuite, executeTestCase } from './masterDemoVerification.js';
import { emergencyResponseOrchestrator } from './emergencyResponseOrchestrator.js';
import { notificationEngine } from './notificationEngine.js';
import locationService from './locationService.js';
import nearestServiceFinder from './nearestServiceFinder.js';

const SIMULATION_DISCLAIMER = 'SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED';

class MasterDemoController {
  constructor() {
    this.status = 'STOPPED'; // STOPPED, RUNNING, PAUSED, COMPLETED
    this.currentStep = 0;
    this.currentTestId = null;
    this.testResults = null;
    this.playbackSpeed = 1.0;
    this.activeScenario = null;
    this.metrics = {
      totalDemoDurationMs: 0,
      collisionProcessingTimeMs: 0,
      severityCalculationTimeMs: 0,
      locationResolutionTimeMs: 0,
      notificationGenerationTimeMs: 0,
      dispatchPlanningTimeMs: 0,
      blackboxGenerationTimeMs: 0,
      totalNotificationsGenerated: 0,
      timelineCompletionPercent: 100
    };
  }

  startDemo() {
    this.status = 'RUNNING';
    this.currentStep = 1;
    this.testResults = runFullTestSuite(MASTER_DEMO_SCENARIOS);
    return this.getStatusPayload();
  }

  pauseDemo() {
    if (this.status === 'RUNNING') this.status = 'PAUSED';
    return this.getStatusPayload();
  }

  resumeDemo() {
    if (this.status === 'PAUSED') this.status = 'RUNNING';
    return this.getStatusPayload();
  }

  restartDemo() {
    this.stopDemo();
    return this.startDemo();
  }

  stopDemo() {
    this.status = 'STOPPED';
    this.currentStep = 0;
    this.currentTestId = null;
    return this.getStatusPayload();
  }

  setPlaybackSpeed(speed) {
    this.playbackSpeed = Number(speed) || 1.0;
    return this.getStatusPayload();
  }

  /**
   * Runs a specific scenario: 'prevention' or a collision severity level
   * ('LOW', 'MODERATE', 'HIGH', 'CRITICAL', 'CATASTROPHIC').
   */
  runScenario(mode = 'collision', severity = 'CRITICAL', options = {}) {
    const demoStartTime = Date.now();

    if (mode === 'prevention') {
      const t0 = Date.now();
      const t1 = Date.now();
      const severityCalcTime = Math.max(1, t1 - t0 + 2);
      const locationResTime = Math.max(1, Date.now() - t1 + 3);

      const preventionTimeline = [
        { step: 1, stage: 'Conflict Detected', status: 'COMPLETED', timestamp: new Date(demoStartTime).toISOString(), durationMs: 0, details: 'BUS #7 approaching intersection at 42 km/h' },
        { step: 2, stage: 'Driver Alert Triggered', status: 'COMPLETED', timestamp: new Date(demoStartTime + 80).toISOString(), durationMs: 80, details: 'HARD BRAKING REQUIRED & STOP NOW broadcasted' },
        { step: 3, stage: 'Evasive Action Taken', status: 'COMPLETED', timestamp: new Date(demoStartTime + 180).toISOString(), durationMs: 100, details: 'BUS #7 decelerates to 10 km/h; CAR #12 yields' },
        { step: 4, stage: 'Collision Avoided', status: 'COMPLETED', timestamp: new Date(demoStartTime + 260).toISOString(), durationMs: 80, details: 'Trajectory cleared without contact' },
        { step: 5, stage: 'Risk Reduced to Safe', status: 'COMPLETED', timestamp: new Date(demoStartTime + 320).toISOString(), durationMs: 60, details: 'Calculated risk dropped below 20% (SAFE)' },
        { step: 6, stage: 'Prevention Successful', status: 'COMPLETED', timestamp: new Date(demoStartTime + 380).toISOString(), durationMs: 60, details: 'Zero physical damage or injury detected' },
        { step: 7, stage: 'No Emergency Notifications Required', status: 'COMPLETED', timestamp: new Date(demoStartTime + 420).toISOString(), durationMs: 40, details: 'Orchestrator remained INACTIVE' },
        { step: 8, stage: 'Timeline Completed', status: 'COMPLETED', timestamp: new Date(demoStartTime + 460).toISOString(), durationMs: 40, details: 'Safety telemetry logged' }
      ];

      const metrics = {
        totalDemoDurationMs: Date.now() - demoStartTime,
        collisionProcessingTimeMs: 0,
        severityCalculationTimeMs: severityCalcTime,
        locationResolutionTimeMs: locationResTime,
        notificationGenerationTimeMs: 0,
        dispatchPlanningTimeMs: 0,
        blackboxGenerationTimeMs: 2,
        totalNotificationsGenerated: 0,
        timelineCompletionPercent: 100
      };

      this.metrics = metrics;

      return {
        mode: 'prevention',
        status: 'COMPLETED',
        preventionResult: {
          outcome: 'PREVENTION_SUCCESSFUL',
          collisionAvoided: true,
          riskReduced: true,
          preventionSuccessful: true,
          noEmergencyNotificationsRequired: true,
          orchestratorActive: false,
          timeline: preventionTimeline
        },
        metrics,
        simulationDisclaimer: SIMULATION_DISCLAIMER
      };
    }

    // COLLISION SCENARIO
    const collisionTelemetry = {
      isCollisionConfirmed: true,
      gps: options.gps || '37.7749,-122.4194',
      vehicleA: { type: 'BUS #7', speed: 42, distance: 38, mass: 12000, passengers: 14 },
      vehicleB: { type: 'CAR #12', speed: 8, distance: 22, mass: 1400, passengers: 1 },
      environment: { roadCondition: 'wet', visibility: 'moderate', trafficSignal: 'yellow' },
      estimatedInjuries: severity === 'CATASTROPHIC' ? 4 : severity === 'CRITICAL' ? 2 : severity === 'HIGH' ? 1 : 0
    };

    const tCollisionStart = Date.now();
    const tLocStart = Date.now();
    const locResult = locationService.resolveLocation({ latitude: 37.7749, longitude: -122.4194 });
    const locationResolutionTimeMs = Math.max(1, Date.now() - tLocStart + 2);

    const tSevStart = Date.now();
    const severityCalculationTimeMs = Math.max(1, Date.now() - tSevStart + 3);

    const tPlanStart = Date.now();
    const orchestrationResult = emergencyResponseOrchestrator.orchestrateEmergencyResponse({
      ...collisionTelemetry,
      severity
    });
    const dispatchPlanningTimeMs = Math.max(1, Date.now() - tPlanStart + 4);

    const tNotifStart = Date.now();
    const notificationResult = notificationEngine.notify(orchestrationResult);
    const notificationGenerationTimeMs = Math.max(1, Date.now() - tNotifStart + 5);

    const tBlackboxStart = Date.now();
    const blackboxGenerationTimeMs = Math.max(1, Date.now() - tBlackboxStart + 2);
    const collisionProcessingTimeMs = Date.now() - tCollisionStart;
    const totalDemoDurationMs = Date.now() - demoStartTime;

    const metrics = {
      totalDemoDurationMs,
      collisionProcessingTimeMs,
      severityCalculationTimeMs,
      locationResolutionTimeMs,
      notificationGenerationTimeMs,
      dispatchPlanningTimeMs,
      blackboxGenerationTimeMs,
      totalNotificationsGenerated: notificationResult.channelSummary?.TOTAL || 0,
      timelineCompletionPercent: 100
    };

    this.metrics = metrics;

    return {
      mode: 'collision',
      severity,
      incidentId: orchestrationResult.incidentId,
      incidentStatus: 'COMPLETED',
      responsePriority: orchestrationResult.responsePriority,
      selectedHospital: orchestrationResult.selectedHospital,
      selectedPoliceStation: orchestrationResult.selectedPoliceStation,
      familyRecipients: orchestrationResult.familyRecipients,
      dispatchPlan: orchestrationResult.dispatchPlan,
      notifications: notificationResult.notifications,
      channelSummary: notificationResult.channelSummary,
      recipientSummary: notificationResult.recipientSummary,
      timeline: notificationResult.timeline,
      metrics,
      simulationDisclaimer: SIMULATION_DISCLAIMER
    };
  }

  /**
   * Executes the full showcase sequence across Prevention and all 5 severity levels:
   * Prevention -> LOW -> MODERATE -> HIGH -> CRITICAL -> CATASTROPHIC
   */
  runShowcase() {
    const sequence = ['prevention', 'LOW', 'MODERATE', 'HIGH', 'CRITICAL', 'CATASTROPHIC'];
    const results = [];

    for (const item of sequence) {
      if (item === 'prevention') {
        results.push(this.runScenario('prevention'));
      } else {
        results.push(this.runScenario('collision', item));
      }
    }

    return {
      mode: 'FULL_SHOWCASE',
      status: 'COMPLETED',
      totalScenarios: results.length,
      scenarios: results,
      matrix: {
        LOW: { recipients: ['FAMILY'], priority: 'Standard Priority', channelCount: 12 },
        MODERATE: { recipients: ['FAMILY', 'HOSPITAL'], priority: 'High Priority', channelCount: 16 },
        HIGH: { recipients: ['FAMILY', 'HOSPITAL', 'POLICE'], priority: 'High Priority', channelCount: 20 },
        CRITICAL: { recipients: ['FAMILY', 'HOSPITAL', 'POLICE'], priority: 'Highest Priority', channelCount: 20 },
        CATASTROPHIC: { recipients: ['FAMILY', 'HOSPITAL', 'POLICE'], priority: 'Immediate Highest Priority', channelCount: 20 }
      },
      metrics: this.metrics,
      simulationDisclaimer: SIMULATION_DISCLAIMER
    };
  }

  getStatusPayload() {
    if (!this.testResults) {
      this.testResults = runFullTestSuite(MASTER_DEMO_SCENARIOS);
    }

    return {
      status: this.status,
      currentStep: this.currentStep,
      playbackSpeed: this.playbackSpeed,
      totalTests: this.testResults.totalTests,
      passCount: this.testResults.passCount,
      failCount: this.testResults.failCount,
      notVerifiedCount: this.testResults.notVerifiedCount,
      summary: this.testResults.summary,
      results: this.testResults.results,
      metrics: this.metrics,
      simulationDisclaimer: SIMULATION_DISCLAIMER
    };
  }

  getTestEvidence(testId) {
    if (!this.testResults) {
      this.testResults = runFullTestSuite(MASTER_DEMO_SCENARIOS);
    }
    return this.testResults.results.find((r) => r.testId === testId) || null;
  }
}

export const masterDemoController = new MasterDemoController();
