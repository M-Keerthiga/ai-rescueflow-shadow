/**
 * AI RESCUEFLOW SHADOW — Deterministic Physics Risk Engine
 * Calculates physics-backed "Predicted Collision Risk" (%), Time-to-Collision (TTC),
 * required stopping distances, dominant risk factors, and simultaneous targeted driver HUD alerts.
 */

import { getRiskCategory, evaluateAlertPolicy } from './alertPolicyEngine.js';

export function calculateRisk(vehicleA, vehicleB, environment) {
  // Extract parameters with physics bounds
  const speedA = Math.max(0, Number(vehicleA.speed) || 0); // km/h
  const distA = Math.max(1, Number(vehicleA.distance) || 1); // meters
  const brakCapA = vehicleA.brakingCapability || 'medium';
  const reactTimeA = Math.max(0.5, Number(vehicleA.reactionTime) || 1.2); // seconds

  const speedB = Math.max(0, Number(vehicleB.speed) || 0); // km/h
  const distB = Math.max(1, Number(vehicleB.distance) || 1); // meters
  const brakCapB = vehicleB.brakingCapability || 'medium';
  const reactTimeB = Math.max(0.5, Number(vehicleB.reactionTime) || 1.0);

  const roadCond = environment.roadCondition || 'dry'; // dry, wet, icy
  const visibility = environment.visibility || 'good'; // good, moderate, poor
  const trafficDensity = environment.trafficDensity || 'moderate'; // low, moderate, high
  const trafficSignal = environment.trafficSignal || 'yellow'; // green, yellow, red, none

  // 1. Velocity Conversions (m/s)
  const vA = speedA / 3.6;
  const vB = speedB / 3.6;

  // 2. Time-To-Intersection (TTI) for each vehicle
  const ttiA = vA > 0 ? distA / vA : 999;
  const ttiB = vB > 0 ? distB / vB : 999;

  // Relative Velocity (m/s) & Orthogonal Intersection vector
  const relVelMS = Math.sqrt(vA * vA + vB * vB);
  const relVelKmH = Math.round(relVelMS * 3.6);
  const deltaTTI = Math.abs(ttiA - ttiB);

  // Time To Collision (TTC) estimate (seconds)
  let ttc = Math.min(ttiA, ttiB) + 0.6 * deltaTTI;
  if (vA <= 0.5 && vB <= 0.5) ttc = 99; // stationary
  ttc = Number(Math.max(0.1, ttc).toFixed(2));

  // 3. Stopping Distance Calculations
  let mu = 0.8; // dry asphalt friction
  if (roadCond === 'wet') mu = 0.5;
  if (roadCond === 'icy') mu = 0.2;

  const getBrakeMod = (cap) => {
    if (cap === 'poor') return 0.6;
    if (cap === 'good') return 1.0;
    return 0.8; // medium
  };

  const g = 9.81;
  const accelBrakeA = g * mu * getBrakeMod(brakCapA);
  const accelBrakeB = g * mu * getBrakeMod(brakCapB);

  const dReactA = vA * reactTimeA;
  const dBrakeA = (vA * vA) / (2 * accelBrakeA);
  const dStopA = Number((dReactA + dBrakeA).toFixed(1));

  const dReactB = vB * reactTimeB;
  const dBrakeB = (vB * vB) / (2 * accelBrakeB);
  const dStopB = Number((dReactB + dBrakeB).toFixed(1));

  const stopRatioA = dStopA / distA;
  const stopRatioB = dStopB / distB;

  // 4. Environmental Risk Multipliers
  let visMod = 1.0;
  if (visibility === 'moderate') visMod = 1.2;
  if (visibility === 'poor') visMod = 1.45;

  let densityMod = 1.0;
  if (trafficDensity === 'moderate') densityMod = 1.15;
  if (trafficDensity === 'high') densityMod = 1.35;

  let signalMod = 1.0;
  if (trafficSignal === 'yellow') signalMod = 1.25;
  if (trafficSignal === 'red') signalMod = 1.4;
  if (trafficSignal === 'none') signalMod = 1.3;

  // 5. Deterministic Risk Score Formula (0-99%)
  let ttcFactor = 0;
  if (ttc <= 8) {
    ttcFactor = Math.min(100, Math.exp((5.5 - ttc) * 0.55) * 22);
  }

  const maxStopRatio = Math.max(stopRatioA, stopRatioB);
  let stopFactor = Math.min(100, Math.max(0, (maxStopRatio - 0.5) * 110));

  let rawRisk = 0.55 * ttcFactor + 0.45 * stopFactor;

  if (deltaTTI < 2.5 && (vA > 3 || vB > 3)) {
    rawRisk += (2.5 - deltaTTI) * 12;
  }

  let finalRiskValue = Math.round(rawRisk * visMod * densityMod * signalMod);
  finalRiskValue = Math.min(98, Math.max(12, finalRiskValue));

  // Centralized Category determination (0-19 SAFE, 20-39 LOW, 40-59 MEDIUM, 60-79 HIGH, 80-99 CRITICAL)
  const category = getRiskCategory(finalRiskValue);

  // Evaluate full alert policy (with TTC & stopping distance overrides)
  const tempResult = {
    predictedCollisionRisk: finalRiskValue,
    category,
    estimatedTTC: ttc,
    vehicleA: { stoppingDistanceMeters: dStopA, availableDistanceMeters: distA },
    vehicleB: { stoppingDistanceMeters: dStopB, availableDistanceMeters: distB }
  };
  const policyResult = evaluateAlertPolicy(tempResult);
  const alertState = policyResult.highestApplicableState;
  const dominantReason = policyResult.dominantReason;

  // Dominant Risk Factor Determination
  let dominantFactor = dominantReason;
  if (dStopA > distA) {
    dominantFactor = 'INSUFFICIENT_BRAKING_DISTANCE_BUS';
  } else if (ttc <= 2.5) {
    dominantFactor = 'TTC OVERRIDE (SHORT_TIME_TO_COLLISION)';
  } else if (roadCond !== 'dry') {
    dominantFactor = 'REDUCED_ROAD_SURFACE_FRICTION';
  } else if (trafficSignal === 'yellow' || trafficSignal === 'red') {
    dominantFactor = 'INTERSECTION_SIGNAL_HAZARD';
  }

  // Dynamic Actions for Driver A (Bus #7) and Driver B (Car #12)
  const driverAActions = generateDriverAction('A', vehicleA, distA, speedA, dStopA, ttc, alertState, trafficSignal);
  const driverBActions = generateDriverAction('B', vehicleB, distB, speedB, dStopB, ttc, alertState, trafficSignal);

  return {
    predictedCollisionRisk: finalRiskValue, // % UI metric
    category, // SAFE, LOW, MEDIUM, HIGH, CRITICAL
    alertState, // NORMAL, CAUTION, WARNING, URGENT, CRITICAL, COLLISION
    alertDriver: dominantReason,
    estimatedTTC: ttc,
    relativeVelocityKmH: relVelKmH,
    deltaTTI: Number(deltaTTI.toFixed(2)),
    dominantFactor,
    vehicleA: {
      ...vehicleA,
      stoppingDistanceMeters: dStopA,
      availableDistanceMeters: distA,
      stoppingRatio: Number(stopRatioA.toFixed(2)),
      isDeficit: dStopA > distA,
      recommendedAction: driverAActions.actionText,
      urgencyLevel: driverAActions.urgency
    },
    vehicleB: {
      ...vehicleB,
      stoppingDistanceMeters: dStopB,
      availableDistanceMeters: distB,
      stoppingRatio: Number(stopRatioB.toFixed(2)),
      isDeficit: dStopB > distB,
      recommendedAction: driverBActions.actionText,
      urgencyLevel: driverBActions.urgency
    },
    environmentalFactors: {
      roadCondition: roadCond,
      visibility,
      trafficDensity,
      trafficSignal,
      frictionCoefficient: mu,
      visibilityImpactScore: visMod
    },
    riskFactors: [
      { name: 'Estimated Time to Collision (TTC)', value: `${ttc}s`, impact: ttc < 2.5 ? 'CRITICAL' : ttc < 4 ? 'HIGH' : 'LOW' },
      { name: 'Bus Stopping Margin', value: `${dStopA}m req vs ${distA}m avail`, impact: dStopA > distA ? 'CRITICAL' : 'SAFE' },
      { name: 'Road Friction', value: `${roadCond.toUpperCase()} (μ=${mu})`, impact: roadCond !== 'dry' ? 'HIGH' : 'NORMAL' },
      { name: 'Intersection Signal', value: trafficSignal.toUpperCase(), impact: trafficSignal === 'yellow' ? 'HIGH' : 'NORMAL' }
    ],
    timestamp: new Date().toISOString()
  };
}

function generateDriverAction(driverId, vehicle, distance, speed, stopDist, ttc, state, signal) {
  const isBus = (vehicle.type || '').toLowerCase().includes('bus') || driverId === 'A';
  const vehicleName = vehicle.type || (isBus ? 'BUS #7' : 'CAR #12');

  if (state === 'NORMAL') {
    return {
      urgency: 'NORMAL',
      actionText: `${vehicleName}: Maintain safe cruising speed (${speed} km/h). Clear path ahead.`
    };
  }

  if (state === 'CAUTION') {
    if (isBus) {
      return {
        urgency: 'MODERATE',
        actionText: `${vehicleName} Driver: Cover brake pedal now. Prepare to decelerate. Intersection distance ${distance}m with signal ${signal.toUpperCase()}.`
      };
    } else {
      return {
        urgency: 'MODERATE',
        actionText: `${vehicleName} Driver: Proceed cautiously through crosswalk. Yield right of way to heavy approaching vehicles.`
      };
    }
  }

  if (state === 'WARNING') {
    if (isBus) {
      return {
        urgency: 'MODERATE',
        actionText: `${vehicleName} Driver: Apply brake now. Intersection conflict window closing (${ttc}s).`
      };
    } else {
      return {
        urgency: 'MODERATE',
        actionText: `${vehicleName} Driver: Decelerate immediately. Yield right of way at intersection.`
      };
    }
  }

  if (state === 'URGENT' || state === 'CRITICAL') {
    if (isBus) {
      const decelReq = (Math.pow(speed / 3.6, 2) / (2 * Math.max(1, distance))).toFixed(1);
      return {
        urgency: 'CRITICAL',
        actionText: `⚠️ ${vehicleName} DRIVER: HARD BRAKING REQUIRED IMMEDIATELY! Required stopping distance (${stopDist}m) exceeds available distance (${distance}m). Decelerate by at least ${decelReq} m/s²!`
      };
    } else {
      return {
        urgency: 'CRITICAL',
        actionText: `🚨 ${vehicleName} DRIVER: STOP NOW & YIELD! Do not cross intersection. Heavy College Bus #7 approaching at ${speed} km/h (${ttc}s to intersection).`
      };
    }
  }

  return {
    urgency: 'NORMAL',
    actionText: `${vehicleName}: Observe standard traffic rules.`
  };
}
