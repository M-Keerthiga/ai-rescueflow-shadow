/**
 * AI RESCUEFLOW SHADOW — Emergency Demo Simulation Data Provider
 * Provides robust fallback simulation data when the live backend API is unreachable
 * or when in standalone demo simulation mode.
 * 
 * DISCLAIMER: SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED
 */

export const SIMULATION_DISCLAIMER = 'SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED';

export const DEMO_EMERGENCY_DATA = {
  incidentId: 'INC-SIM-DEMO-8841',
  severity: 'CRITICAL',
  incidentStatus: 'COMPLETED',
  currentStatus: 'SIMULATED_SENT',
  dispatchStatus: 'ALL_CHANNELS_DISPATCHED_SIMULATED',
  responsePriority: 'Highest Priority',
  simulationDisclaimer: SIMULATION_DISCLAIMER,
  timestamp: new Date().toISOString(),

  location: {
    GPS: '37.774900, -122.419400',
    nearestCity: 'San Francisco',
    'nearest city': 'San Francisco',
    roadName: 'Market Street Urban Transit Corridor (Eastbound)',
    'road name': 'Market Street Urban Transit Corridor (Eastbound)',
    confidence: 0.98,
    coordinates: {
      latitude: 37.7749,
      longitude: -122.4194
    }
  },

  selectedHospital: {
    id: 'HOSP-SF-01',
    name: 'Metro General & Trauma Hospital',
    distanceKm: 2.3,
    etaMinutes: 4,
    availability: 'CRITICAL_BEDS_READY',
    priority: 'LEVEL_1_TRAUMA',
    phone: '+1-555-019-4821',
    email: 'trauma.dispatch@metrogeneral.demo'
  },

  selectedPoliceStation: {
    id: 'POL-SF-01',
    name: 'SFPD Central Traffic Division & Highway Patrol',
    distanceKm: 1.8,
    etaMinutes: 3,
    availability: 'PATROL_EN_ROUTE',
    priority: 'RAPID_INTERCEPTOR',
    phone: '+1-555-019-9112',
    email: 'dispatch@sfpd.demo'
  },

  familyRecipients: [
    {
      id: 'FAM-001',
      name: 'Sarah Jenkins',
      relationship: 'Spouse',
      phone: '+1-555-019-3321',
      email: 'sarah.jenkins@familycontact.demo',
      priority: 1,
      status: 'SIMULATED_SENT'
    },
    {
      id: 'FAM-002',
      name: 'David Jenkins Sr.',
      relationship: 'Parent',
      phone: '+1-555-019-3322',
      email: 'david.jenkins@familycontact.demo',
      priority: 2,
      status: 'SIMULATED_SENT'
    },
    {
      id: 'FAM-003',
      name: 'Emily Jenkins',
      relationship: 'Sibling',
      phone: '+1-555-019-3323',
      email: 'emily.jenkins@familycontact.demo',
      priority: 3,
      status: 'SIMULATED_SENT'
    }
  ],

  channelSummary: {
    SMS: 5,
    PHONE: 5,
    EMAIL: 5,
    PUSH: 5,
    TOTAL: 20
  },

  recipientSummary: {
    FAMILY: 3,
    HOSPITAL: 1,
    POLICE: 1,
    TOTAL: 5
  },

  statusCounts: {
    generated: 20,
    simulatedSent: 20,
    duplicateSkipped: 0,
    failed: 0,
    retrying: 0
  },

  timeline: [
    {
      stage: 'INCIDENT_VERIFIED',
      label: 'Collision Confirmed by RescueFlow Severity Engine',
      timestamp: new Date(Date.now() - 12000).toISOString(),
      durationMs: 140,
      status: 'COMPLETED',
      detail: 'Impact kinetic telemetry verified. Critical response activated in simulation mode.'
    },
    {
      stage: 'GEOSPATIAL_LOCKED',
      label: 'Geospatial Location & Road Network Resolved',
      timestamp: new Date(Date.now() - 10000).toISOString(),
      durationMs: 85,
      status: 'COMPLETED',
      detail: 'GPS coordinates locked to Market Street Urban Transit Corridor (37.774900, -122.419400).'
    },
    {
      stage: 'DISPATCH_PLANNED',
      label: 'Severity Policy Applied (Highest Priority)',
      timestamp: new Date(Date.now() - 8000).toISOString(),
      durationMs: 95,
      status: 'COMPLETED',
      detail: 'Assigned units: Level 1 Trauma Ambulance (ALS) & Emergency Incident Command Interceptor.'
    },
    {
      stage: 'CHANNELS_DISPATCHED',
      label: 'Simulated Notifications Dispatched',
      timestamp: new Date(Date.now() - 4000).toISOString(),
      durationMs: 230,
      status: 'COMPLETED',
      detail: '20 simulated notifications transmitted across SMS, Phone, Email, and Push channels.'
    },
    {
      stage: 'ORCHESTRATION_COMPLETED',
      label: 'Emergency Response Orchestration Finalized',
      timestamp: new Date().toISOString(),
      durationMs: 60,
      status: 'COMPLETED',
      detail: 'Zero real emergency services contacted. All telemetry archived in simulation history.'
    }
  ],

  dispatchPlan: [
    {
      id: 'DSP-HOSP-SF01',
      recipientType: 'Hospital',
      name: 'Metro General & Trauma Hospital',
      unitType: 'Level 1 Trauma Life Support Ambulance (ALS)',
      status: 'SIMULATED_DISPATCHED',
      etaMinutes: 4,
      distanceKm: 2.3,
      priority: 'Highest Priority',
      assignedAction: 'Rapid dispatch with hydraulic extrication standby; prepare Level 1 Trauma resuscitation bay'
    },
    {
      id: 'DSP-POL-SF01',
      recipientType: 'Police',
      name: 'SFPD Central Traffic Division',
      unitType: 'Emergency Incident Command & Rapid Interceptor',
      status: 'SIMULATED_DISPATCHED',
      etaMinutes: 3,
      distanceKm: 1.8,
      priority: 'Highest Priority',
      assignedAction: 'Immediate multi-lane corridor lockdown, divert traffic grid, secure crash telematics'
    },
    {
      id: 'DSP-FAM-001',
      recipientType: 'Family',
      name: 'Sarah Jenkins (Spouse)',
      unitType: 'Automated Telematics Gateway',
      status: 'SIMULATED_NOTIFICATION_SENT',
      etaMinutes: 0,
      priority: 'Primary Contact',
      assignedAction: 'Simulated multi-channel advisory delivered via SMS, Phone, Email, and Push'
    }
  ]
};

export default DEMO_EMERGENCY_DATA;
