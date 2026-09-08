/**
 * AI RESCUEFLOW SHADOW — AI RescueFlow Post-Collision Severity & Emergency Engine
 * Computes severity dynamically from crash telemetry (velocity, mass, g-force, kinetic energy).
 */

export function analyzeIncident(telemetry) {
  const speedA = Number(telemetry?.vehicleA?.speed || 42);
  const speedB = Number(telemetry?.vehicleB?.speed || 8);
  const massA = Number(telemetry?.vehicleA?.mass || 12000); // kg (Bus)
  const massB = Number(telemetry?.vehicleB?.mass || 1400); // kg (Car)
  const angle = 90; // Intersection angle degrees

  // 1. Dynamic Physics Calculations
  const vA_ms = speedA / 3.6;
  const vB_ms = speedB / 3.6;
  
  // Relative Impact Velocity (m/s)
  const relImpactVel = Math.sqrt(vA_ms * vA_ms + vB_ms * vB_ms + 2 * vA_ms * vB_ms * Math.cos((angle * Math.PI) / 180));
  const relImpactKmH = Math.round(relImpactVel * 3.6);

  // Impact deceleration duration (seconds)
  const impactDuration = 0.12;

  // G-Force Calculations
  const gForceA = Number(((vA_ms * 0.7) / (impactDuration * 9.81)).toFixed(1));
  const gForceB = Number((relImpactVel / (impactDuration * 9.81)).toFixed(1)); // Car takes higher g-force

  // Kinetic Energy Transfer (kJ)
  const keA = 0.5 * massA * vA_ms * vA_ms;
  const keB = 0.5 * massB * vB_ms * vB_ms;
  const totalKE_kJ = Math.round((keA + keB) / 1000);

  // 2. Severity Classification Mapping
  let severity = 'MODERATE';
  let severityScore = 48;
  let casualtyRisk = 'MODERATE';
  let vehicleDeformation = 'MODERATE SIDE-PANEL CRUSH';
  let dominantSeverityDriver = 'SIDE_IMPACT_KINETIC_TRANSFER';

  if (gForceB >= 25 || relImpactKmH >= 65) {
    severity = 'CATASTROPHIC';
    severityScore = 96;
    casualtyRisk = 'VERY HIGH (CRITICAL TRAUMA)';
    vehicleDeformation = 'TOTALED / CABIN STRUCTURAL FAILURE';
    dominantSeverityDriver = 'SEVERE_G_FORCE_CABIN_COLLAPSE';
  } else if (gForceB >= 12 || relImpactKmH >= 40) {
    severity = 'CRITICAL';
    severityScore = 86;
    casualtyRisk = 'HIGH (HYDRAULIC EXTRICATION REQUIRED)';
    vehicleDeformation = 'SEVERE DRIVER-SIDE CABIN INTRUSION';
    dominantSeverityDriver = 'CRITICAL_SEDAN_G_FORCE_INTRUSION';
  } else if (relImpactKmH <= 18) {
    severity = 'LOW';
    severityScore = 28;
    casualtyRisk = 'LOW (MINOR INJURIES)';
    vehicleDeformation = 'LIGHT BUMPER SCRATCH & PLASTIC CRUSH';
    dominantSeverityDriver = 'LOW_VELOCITY_IMPACT';
  }

  const incidentId = `INC-${Date.now().toString().slice(-6)}`;
  const timestamp = new Date().toISOString();

  // 3. Automated Emergency Service Dispatch Plan
  const dispatches = generateDispatchPlan(severity, relImpactKmH);

  // 4. Response Timeline Progression
  const responseTimeline = generateResponseTimeline(severity);

  // 5. Prevention Insights
  const preventionInsights = generatePreventionInsights(telemetry, relImpactKmH, gForceB);

  return {
    incidentId,
    timestamp,
    status: 'ACTIVE_RESPONSE',
    simulationDisclaimer: 'SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED',
    impactAnalysis: {
      relativeImpactSpeedKmH: relImpactKmH,
      gForceVehicleA: gForceA,
      gForceVehicleB: gForceB,
      kineticEnergyKJ: totalKE_kJ,
      impactAngle: '90° T-Bone Intersection Conflict',
      vehicleDeformation,
      casualtyRisk
    },
    severity: {
      level: severity, // LOW, MODERATE, HIGH, CRITICAL, CATASTROPHIC
      score: severityScore,
      dominantSeverityDriver,
      description: getSeverityDescription(severity, relImpactKmH)
    },
    vehiclesInvolved: [
      {
        id: 'A',
        type: telemetry?.vehicleA?.type || 'BUS #7',
        preImpactSpeed: `${speedA} km/h`,
        estimatedPassengers: 28,
        damageStatus: 'Front Bumper & Engine Grill Compression'
      },
      {
        id: 'B',
        type: telemetry?.vehicleB?.type || 'CAR #12',
        preImpactSpeed: `${speedB} km/h`,
        estimatedOccupants: 2,
        damageStatus: 'Severe Driver-Side Door Intrusion'
      }
    ],
    dispatches,
    responseTimeline,
    preventionInsights
  };
}

function generateDispatchPlan(severity, impactSpeed) {
  const isHigh = severity === 'CRITICAL' || severity === 'CATASTROPHIC';

  return [
    {
      unitId: 'EMS-TRAUMA-102',
      agency: 'Metro Level 1 Trauma Center',
      type: 'Advanced Life Support Ambulance',
      status: 'DISPATCHED',
      etaMinutes: isHigh ? 4 : 7,
      distanceKm: 2.4,
      contactChannel: 'CH-9 (EMERGENCY)',
      assignedAction: isHigh ? 'Rapid trauma stabilization & hydraulic extrication team' : 'Medical triage and occupant check'
    },
    {
      unitId: 'RESCUE-TENDER-04',
      agency: 'City Fire & Heavy Rescue Dept',
      type: 'Heavy Extrication Fire Tender',
      status: 'DISPATCHED',
      etaMinutes: isHigh ? 5 : 9,
      distanceKm: 3.1,
      contactChannel: 'CH-14 (FIRE)',
      assignedAction: 'Deploy hydraulic cutters, battery isolation & fuel spill containment'
    },
    {
      unitId: 'TRAFFIC-POLICE-P8',
      agency: 'Metropolitan Traffic Command',
      type: 'Highway Patrol Interceptor',
      status: 'DISPATCHED',
      etaMinutes: 3,
      distanceKm: 1.2,
      contactChannel: 'CH-1 (POLICE)',
      assignedAction: 'Block intersection lanes, divert bus traffic, preserve blackbox telemetry'
    },
    {
      unitId: 'TOW-HEAVY-99',
      agency: 'City Highway Clearance Corp',
      type: 'Heavy Hydraulic Tow Crane',
      status: 'STANDBY',
      etaMinutes: 14,
      distanceKm: 6.8,
      contactChannel: 'CH-3 (LOGISTICS)',
      assignedAction: 'Clear college bus and passenger sedan after police scene investigation'
    }
  ];
}

function generateResponseTimeline(severity) {
  const now = new Date();
  const addSec = (sec) => new Date(now.getTime() + sec * 1000).toLocaleTimeString();

  return [
    { step: 1, label: 'Impact Detected & Telemetry Logged', time: addSec(0), status: 'COMPLETED', detail: 'Sensors registered deceleration. AI RescueFlow triggered automatically.' },
    { step: 2, label: 'Emergency Dispatches Triggered', time: addSec(5), status: 'IN_PROGRESS', detail: 'Ambulance EMS-102 & Fire Tender 04 alerted via Automated CAD dispatch.' },
    { step: 3, label: 'Traffic Signal Lockdown', time: addSec(15), status: 'PENDING', detail: 'Intersection signal switched to ALL-RED emergency corridor mode.' },
    { step: 4, label: 'First Responders On Scene', time: addSec(240), status: 'PENDING', detail: 'Patrol P8 arrives for perimeter setup and traffic redirection.' },
    { step: 5, label: 'Extrication & Medical Transport', time: addSec(360), status: 'PENDING', detail: 'Trauma team extricates sedan occupants and transports to Metro Hospital.' },
    { step: 6, label: 'Scene Clearance & Blackbox Logged', time: addSec(900), status: 'PENDING', detail: 'Towing unit clears intersection. Incident telemetry finalized into safety database.' }
  ];
}

function generatePreventionInsights(telemetry, impactSpeed, gForce) {
  return [
    {
      id: 'INS-01',
      category: 'INFRASTRUCTURE',
      title: 'Smart Intersection Signal Calibration',
      recommendation: 'Extend Yellow Signal duration by +2.5 seconds at this high-density intersection to accommodate heavy vehicle braking distances.',
      impact: 'Reduces high-speed bus entry conflict probability by 42%.',
      priority: 'HIGH'
    },
    {
      id: 'INS-02',
      category: 'SPEED MANAGEMENT',
      title: 'Geofenced Speed Limiter Activation',
      recommendation: 'Enforce automatic 30 km/h geofenced speed limiters for college buses within 100m of blind urban intersections.',
      impact: 'Reduces impact kinetic energy by over 60%.',
      priority: 'HIGH'
    },
    {
      id: 'INS-03',
      category: 'V2X TELEMATICS',
      title: 'Active Connected Vehicle Alert Systems',
      recommendation: 'Mandate V2X blind-spot cross-traffic warning HUD in ride-hailing vehicle fleets.',
      impact: 'Provides driver warning 3.2 seconds prior to line-of-sight visual acquisition.',
      priority: 'MEDIUM'
    }
  ];
}

function getSeverityDescription(severity, impactSpeed) {
  switch (severity) {
    case 'CATASTROPHIC':
      return 'Extremely violent collision with high probability of life-threatening trauma and total structural vehicle loss.';
    case 'CRITICAL':
      return 'High-energy side impact requiring immediate hydraulic extrication and emergency medical dispatch.';
    case 'MODERATE':
      return 'Moderate impact with localized vehicle damage and mandatory medical evaluation for occupants.';
    default:
      return 'Low-velocity fender collision with minimal occupant hazard.';
  }
}
