/**
 * AI RESCUEFLOW SHADOW — Centralized Alert Policy & State Machine Engine
 * Implements exact risk categories, TTC thresholds, stopping distance overrides,
 * anti-spam suppression, emergency escalation, and 1500ms recovery de-escalation.
 */

export const ALERT_STATES = {
  NORMAL: 'NORMAL',
  CAUTION: 'CAUTION',
  WARNING: 'WARNING',
  URGENT: 'URGENT',
  CRITICAL: 'CRITICAL',
  COLLISION: 'COLLISION'
};

export function getRiskCategory(riskScore) {
  const score = Math.max(0, Math.min(99, Math.round(Number(riskScore) || 0)));
  if (score <= 19) return 'SAFE';
  if (score <= 39) return 'LOW';
  if (score <= 59) return 'MEDIUM';
  if (score <= 79) return 'HIGH';
  return 'CRITICAL';
}

export function evaluateAlertPolicy(riskResult = {}) {
  const safeRisk = riskResult || {};
  const riskScore = Number(safeRisk.predictedCollisionRisk) || 0;
  const ttc = Number(safeRisk.estimatedTTC) || 99;
  const stopDistA = Number(safeRisk.vehicleA?.stoppingDistanceMeters) || 0;
  const availDistA = Number(safeRisk.vehicleA?.availableDistanceMeters) || 1;
  const stopDistB = Number(safeRisk.vehicleB?.stoppingDistanceMeters) || 0;
  const availDistB = Number(safeRisk.vehicleB?.availableDistanceMeters) || 1;

  // Base state from centralized risk score category
  const category = getRiskCategory(riskScore);
  let baseState = ALERT_STATES.NORMAL;

  if (category === 'LOW') baseState = ALERT_STATES.CAUTION;
  if (category === 'MEDIUM') baseState = ALERT_STATES.WARNING;
  if (category === 'HIGH') baseState = ALERT_STATES.URGENT;
  if (category === 'CRITICAL') baseState = ALERT_STATES.CRITICAL;

  let highestState = baseState;
  let dominantReason = 'RISK SCORE CATEGORY';

  // 1. TTC Override Rules
  let ttcState = ALERT_STATES.NORMAL;
  if (ttc <= 1.4) {
    ttcState = ALERT_STATES.CRITICAL;
  } else if (ttc <= 2.4) {
    ttcState = ALERT_STATES.URGENT;
  } else if (ttc <= 3.9) {
    ttcState = ALERT_STATES.WARNING;
  } else if (ttc <= 5.9) {
    ttcState = ALERT_STATES.CAUTION;
  }

  // 2. Stopping Distance Override Rules
  const maxStopRatio = Math.max(stopDistA / availDistA, stopDistB / availDistB);
  let stopState = ALERT_STATES.NORMAL;
  if (maxStopRatio > 1.5 && ttc <= 2.5) {
    stopState = ALERT_STATES.CRITICAL; // Critical Override
  } else if (maxStopRatio > 1.25) {
    stopState = ALERT_STATES.URGENT;
  } else if (maxStopRatio > 1.0) {
    stopState = ALERT_STATES.WARNING;
  }

  // State priority mapping
  const statePriority = {
    NORMAL: 0,
    CAUTION: 1,
    WARNING: 2,
    URGENT: 3,
    CRITICAL: 4,
    COLLISION: 5
  };

  const basePrio = statePriority[baseState];
  const ttcPrio = statePriority[ttcState];
  const stopPrio = statePriority[stopState];

  const maxPrio = Math.max(basePrio, ttcPrio, stopPrio);

  for (const [state, prio] of Object.entries(statePriority)) {
    if (prio === maxPrio) {
      highestState = state;
      break;
    }
  }

  if (maxPrio > basePrio) {
    if (ttcPrio === maxPrio) {
      dominantReason = 'TTC OVERRIDE';
    } else if (stopPrio === maxPrio) {
      dominantReason = 'STOPPING DISTANCE OVERRIDE';
    }
  }

  return {
    riskCategory: category,
    baseState,
    highestApplicableState: highestState,
    dominantReason,
    maxStopRatio: Number(maxStopRatio.toFixed(2)),
    ttc
  };
}

export class AlertStateMachine {
  constructor(interactionId = 'BUS7_CAR12') {
    this.interactionId = interactionId;
    this.currentState = ALERT_STATES.NORMAL;
    this.previousState = ALERT_STATES.NORMAL;
    this.lastStateChangeTime = Date.now();
    this.recoveryStartTime = null;
    this.entryEventCount = 0;
    this.frameCounter = 0;
    this.eventLog = [];
    this.isTerminalCollision = false;
  }

  reset() {
    this.currentState = ALERT_STATES.NORMAL;
    this.previousState = ALERT_STATES.NORMAL;
    this.lastStateChangeTime = Date.now();
    this.recoveryStartTime = null;
    this.entryEventCount = 0;
    this.frameCounter = 0;
    this.eventLog = [];
    this.isTerminalCollision = false;
  }

  processFrame(riskResult, isCollisionConfirmed = false) {
    this.frameCounter++;
    const now = Date.now();

    // Terminal collision state check
    if (this.isTerminalCollision) {
      return {
        currentState: ALERT_STATES.COLLISION,
        previousState: this.previousState,
        isNewEntryEvent: false,
        entryEventCount: this.entryEventCount
      };
    }

    if (isCollisionConfirmed) {
      this.previousState = this.currentState;
      this.currentState = ALERT_STATES.COLLISION;
      this.isTerminalCollision = true;
      this.entryEventCount++;
      this.logEvent('ALERT_COLLISION_TERMINAL', ALERT_STATES.COLLISION);
      return {
        currentState: ALERT_STATES.COLLISION,
        previousState: this.previousState,
        isNewEntryEvent: true,
        entryEventCount: this.entryEventCount
      };
    }

    const policy = evaluateAlertPolicy(riskResult);
    const targetState = policy.highestApplicableState;

    let isNewEntryEvent = false;

    // Escalation vs De-escalation handling
    const statePriority = {
      NORMAL: 0,
      CAUTION: 1,
      WARNING: 2,
      URGENT: 3,
      CRITICAL: 4,
      COLLISION: 5
    };

    const currentPrio = statePriority[this.currentState];
    const targetPrio = statePriority[targetState];

    if (targetPrio > currentPrio) {
      // Escalation
      const isCriticalEscalation = targetState === ALERT_STATES.CRITICAL;
      const cooldownMs = isCriticalEscalation ? 0 : 300;

      if (now - this.lastStateChangeTime >= cooldownMs) {
        this.previousState = this.currentState;
        this.currentState = targetState;
        this.lastStateChangeTime = now;
        this.recoveryStartTime = null;
        this.entryEventCount++;
        isNewEntryEvent = true;
        this.logEvent('ALERT_ESCALATION', targetState);
      }
    } else if (targetPrio < currentPrio) {
      // De-escalation requires 1500ms recovery hysteresis
      if (!this.recoveryStartTime) {
        this.recoveryStartTime = now;
      }

      if (now - this.recoveryStartTime >= 1500) {
        this.previousState = this.currentState;
        this.currentState = targetState; // Legal direct de-escalation
        this.lastStateChangeTime = now;
        this.recoveryStartTime = null;
        this.entryEventCount++;
        isNewEntryEvent = true;
        this.logEvent('ALERT_DEESCALATION', targetState);
      }
    } else {
      // Same state: anti-spam event suppression
      this.recoveryStartTime = null;
    }

    return {
      currentState: this.currentState,
      previousState: this.previousState,
      isNewEntryEvent,
      entryEventCount: this.entryEventCount,
      policy
    };
  }

  logEvent(type, state) {
    this.eventLog.push({
      timestamp: new Date().toISOString(),
      type,
      state,
      frame: this.frameCounter
    });
  }
}
