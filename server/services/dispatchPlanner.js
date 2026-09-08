/**
 * AI RESCUEFLOW SHADOW — Dispatch Planner
 * Implements the RescueFlow Severity Policy and generates tailored emergency dispatch plans and timelines.
 * 
 * SEVERITY POLICY:
 * - LOW: Family
 * - MODERATE: Family, Hospital
 * - HIGH: Family, Hospital, Police
 * - CRITICAL: Family, Hospital, Police, Highest Priority
 * - CATASTROPHIC: Family, Hospital, Police, Immediate Highest Priority
 * 
 * DISCLAIMER: SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED
 */

export const SEVERITY_POLICY = {
  LOW: {
    recipients: ['Family'],
    responsePriority: 'STANDARD',
    displayPriority: 'Standard Priority',
    hospitalDispatched: false,
    policeDispatched: false,
    familyDispatched: true
  },
  MODERATE: {
    recipients: ['Family', 'Hospital'],
    responsePriority: 'ELEVATED',
    displayPriority: 'Elevated Priority',
    hospitalDispatched: true,
    policeDispatched: false,
    familyDispatched: true
  },
  HIGH: {
    recipients: ['Family', 'Hospital', 'Police'],
    responsePriority: 'HIGH',
    displayPriority: 'High Priority',
    hospitalDispatched: true,
    policeDispatched: true,
    familyDispatched: true
  },
  CRITICAL: {
    recipients: ['Family', 'Hospital', 'Police'],
    responsePriority: 'HIGHEST_PRIORITY',
    displayPriority: 'Highest Priority',
    hospitalDispatched: true,
    policeDispatched: true,
    familyDispatched: true
  },
  CATASTROPHIC: {
    recipients: ['Family', 'Hospital', 'Police'],
    responsePriority: 'IMMEDIATE_HIGHEST_PRIORITY',
    displayPriority: 'Immediate Highest Priority',
    hospitalDispatched: true,
    policeDispatched: true,
    familyDispatched: true
  }
};

/**
 * Returns policy configuration for a given severity level.
 */
export function getSeverityPolicy(severity) {
  const norm = String(severity || '').toUpperCase().trim();
  return SEVERITY_POLICY[norm] || SEVERITY_POLICY.MODERATE;
}

/**
 * Generates dispatch actions based on severity policy, nearest facilities, and family contacts.
 */
export function createDispatchPlan({
  incidentId,
  severity,
  location,
  selectedHospital,
  selectedPoliceStation,
  familyRecipients = []
}) {
  const normSeverity = String(severity || '').toUpperCase().trim();
  const policy = getSeverityPolicy(normSeverity);
  const priorityLabel = policy.displayPriority;

  const dispatches = [];

  // 1. Hospital Dispatch (if applicable by policy)
  if (policy.hospitalDispatched && selectedHospital) {
    const isCritical = normSeverity === 'CRITICAL' || normSeverity === 'CATASTROPHIC';
    dispatches.push({
      id: `DSP-HOSP-${incidentId.slice(-4)}`,
      recipientType: 'Hospital',
      recipientId: selectedHospital.id,
      name: selectedHospital.name,
      agency: selectedHospital.name,
      contact: {
        phone: selectedHospital.phone,
        email: selectedHospital.email
      },
      unitType: isCritical ? 'Level 1 Trauma Life Support Ambulance (ALS)' : 'Basic Life Support Paramedic Unit (BLS)',
      status: 'SIMULATED_DISPATCHED',
      etaMinutes: selectedHospital.etaMinutes || 4,
      distanceKm: selectedHospital.distanceKm || 2.5,
      contactChannel: 'SIMULATED_CAD_TRAUMA_NET',
      priority: priorityLabel,
      assignedAction: isCritical
        ? 'Rapid dispatch with hydraulic extrication standby; prepare Level 1 Trauma resuscitation bay'
        : 'Medical triage assessment and occupant vital evaluation'
    });
  }

  // 2. Police Dispatch (if applicable by policy)
  if (policy.policeDispatched && selectedPoliceStation) {
    const isCatastrophic = normSeverity === 'CATASTROPHIC';
    dispatches.push({
      id: `DSP-POL-${incidentId.slice(-4)}`,
      recipientType: 'Police',
      recipientId: selectedPoliceStation.id,
      name: selectedPoliceStation.name,
      agency: selectedPoliceStation.name,
      contact: {
        phone: selectedPoliceStation.phone,
        email: selectedPoliceStation.email
      },
      unitType: isCatastrophic ? 'Emergency Incident Command & Rapid Interceptor' : 'Traffic Enforcement Patrol Unit',
      status: 'SIMULATED_DISPATCHED',
      etaMinutes: selectedPoliceStation.etaMinutes || 3,
      distanceKm: selectedPoliceStation.distanceKm || 1.8,
      contactChannel: 'SIMULATED_POLICE_SECURE_NET',
      priority: priorityLabel,
      assignedAction: isCatastrophic
        ? 'Immediate multi-lane corridor lockdown, divert traffic grid, secure crash telematics'
        : 'Secure intersection perimeter and assist ambulance corridor clearance'
    });
  }

  // 3. Family Contacts (always included in policy)
  if (policy.familyDispatched && Array.isArray(familyRecipients)) {
    familyRecipients.forEach((contact, idx) => {
      dispatches.push({
        id: `DSP-FAM-${contact.id || idx + 1}`,
        recipientType: 'Family',
        recipientId: contact.id || `FAM-${idx + 1}`,
        name: contact.name,
        relationship: contact.relationship || 'Emergency Contact',
        contact: {
          phone: contact.phone,
          email: contact.email
        },
        unitType: 'Automated Telematics Notification Gateway',
        status: 'SIMULATED_NOTIFICATION_SENT',
        etaMinutes: 0,
        contactChannel: 'SIMULATED_EMERGENCY_SMS_GATEWAY',
        priority: contact.priority === 1 ? 'PRIMARY_EMERGENCY_CONTACT' : 'SECONDARY_EMERGENCY_CONTACT',
        assignedAction: `Simulated SMS alert delivered: Collision recorded at ${location?.['road name'] || 'designated location'}. Emergency response initiated under ${priorityLabel}.`
      });
    });
  }

  return {
    incidentId,
    severity: normSeverity,
    responsePriority: priorityLabel,
    policyRecipients: policy.recipients,
    totalDispatches: dispatches.length,
    dispatches,
    simulationDisclaimer: 'SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED'
  };
}

/**
 * Builds chronological response timeline steps.
 */
export function createTimeline(severity, location) {
  const policy = getSeverityPolicy(severity);
  const road = location?.['road name'] || 'Collision Site';
  const now = Date.now();
  const formatSec = (sec) => new Date(now + sec * 1000).toLocaleTimeString();

  const timeline = [
    {
      step: 1,
      time: formatSec(0),
      label: 'Collision Confirmed by RescueFlow Severity Engine',
      status: 'COMPLETED',
      detail: `Impact verified with severity classified as ${severity.toUpperCase()}. Emergency Response Orchestrator activated in simulation mode.`
    },
    {
      step: 2,
      time: formatSec(1),
      label: 'Geospatial Location & Road Network Resolved',
      status: 'COMPLETED',
      detail: `Coordinates locked to ${road} (${location?.GPS || 'GPS Locked'}). Nearest municipal facilities identified.`
    },
    {
      step: 3,
      time: formatSec(3),
      label: `Severity Policy Applied (${policy.displayPriority})`,
      status: 'COMPLETED',
      detail: `Notifying target groups: [${policy.recipients.join(', ')}] based on deterministic policy.`
    }
  ];

  if (policy.hospitalDispatched) {
    timeline.push({
      step: timeline.length + 1,
      time: formatSec(5),
      label: 'Hospital CAD Dispatch Simulated',
      status: 'IN_PROGRESS',
      detail: 'Trauma dispatch telematics sent to nearest medical facility with estimated transit routes.'
    });
  }

  if (policy.policeDispatched) {
    timeline.push({
      step: timeline.length + 1,
      time: formatSec(8),
      label: 'Police Interceptor Dispatched',
      status: 'IN_PROGRESS',
      detail: 'Traffic division notified for perimeter lockdown and signal management.'
    });
  }

  if (policy.familyDispatched) {
    timeline.push({
      step: timeline.length + 1,
      time: formatSec(10),
      label: 'Family Contacts Notification Simulated',
      status: 'COMPLETED',
      detail: 'Emergency notification dispatched via automated gateway with deduplication verification.'
    });
  }

  timeline.push({
    step: timeline.length + 1,
    time: formatSec(240),
    label: 'First Responders Simulated On-Scene',
    status: 'PENDING',
    detail: 'Emergency units arrive for trauma stabilization and scene security.'
  });

  return timeline;
}

export default {
  SEVERITY_POLICY,
  getSeverityPolicy,
  createDispatchPlan,
  createTimeline
};
