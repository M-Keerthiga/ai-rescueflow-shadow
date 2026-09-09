export interface Hospital {
  hospitalId: string;
  hospitalName: string;
  latitude: number;
  longitude: number;
  traumaLevel: number;
  availableBeds: number;
  availableICUBeds: number;
  ambulancesAvailable: number;
  currentLoad: number;
  capacityStatus: string;
  acceptanceStatus: string;
  address: string;
  simulationMode: boolean;
  coordinationScore?: number;
  selectionReason?: string;
}

export interface Ambulance {
  ambulanceId: string;
  crewId: string;
  crewMembers: string[];
  vehicleType: string;
  currentLocation: string | { lat: number; lng: number; address: string };
  status: string;
  etaMinutes: number;
  estimatedArrival: string;
  estimatedHospitalArrival: string;
  assignedIncidentId: string;
  dispatchTime: string;
  simulationMode: boolean;
}

export interface PoliceUnit {
  unitId: string;
  unitType: string;
  officerName: string;
  etaMinutes: number;
  eta?: number;
  status: string;
  assignmentTime: string;
  simulationMode: boolean;
  currentLocation?: { lat: number; lng: number; address: string };
  distanceKm?: number;
  incidentId?: string;
}

export interface TimelineEvent {
  timestamp: string;
  event: string;
  details?: string;
  actor?: string;
}

export interface Incident {
  incidentId: string;
  createdAt: string;
  updatedAt: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  severity: string;
  riskScore: number;
  confidence: number;
  sources: string[];
  sourceCount: number;
  mergeStatus: string;
  timeline: TimelineEvent[];
  hospital: Hospital | null;
  ambulance: Ambulance | null;
  police: PoliceUnit[];
  familyNotification: {
    status: string;
    timestamp: string;
    method: string;
  };
  coordinationStatus: string;
  simulationMode: boolean;
  completionStatus: string;
  blackboxId: string;
  vehicleInvolved: string;
  casualties: number;
  description: string;
  hospitalCandidates?: Hospital[];
  hospitalScore?: number;
}

export interface CitizenReport {
  reportId: string;
  callerId: string;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  description: string;
  callerName: string;
  phoneNumber: string;
  timestamp: string;
  confidence: number;
  status: string;
  severity?: string;
  mergedInto?: string;
  simulationMode: boolean;
  incidentId?: string;
}

export interface Settings {
  hospitalCoordinationEnabled: boolean;
  ambulanceSimulationEnabled: boolean;
  citizenReportsEnabled: boolean;
  hospitalCapacitySimulationEnabled: boolean;
  policeUnitSimulationEnabled: boolean;
  incidentMergeThreshold: number;
  hospitalSelectionStrategy: string;
  etaSimulationEnabled: boolean;
  autoCoordinationEnabled: boolean;
  demoSpeed: number;
  scoringWeights: {
    distance: number;
    beds: number;
    icu: number;
    trauma: number;
    load: number;
    ambulance: number;
  };
}

const hospitals: Hospital[] = [
  {
    hospitalId: "HOSP-01",
    hospitalName: "City Trauma Center",
    latitude: 13.0827,
    longitude: 80.2707,
    traumaLevel: 1,
    availableBeds: 12,
    availableICUBeds: 4,
    ambulancesAvailable: 3,
    currentLoad: 35,
    capacityStatus: "AVAILABLE",
    acceptanceStatus: "PENDING",
    address: "123 Anna Salai, Chennai",
    simulationMode: true,
  },
  {
    hospitalId: "HOSP-02",
    hospitalName: "Metro General Hospital",
    latitude: 13.0569,
    longitude: 80.2425,
    traumaLevel: 2,
    availableBeds: 6,
    availableICUBeds: 1,
    ambulancesAvailable: 2,
    currentLoad: 60,
    capacityStatus: "MODERATE",
    acceptanceStatus: "PENDING",
    address: "456 Mount Road, Chennai",
    simulationMode: true,
  },
  {
    hospitalId: "HOSP-03",
    hospitalName: "National Emergency Hospital",
    latitude: 13.0635,
    longitude: 80.1489,
    traumaLevel: 1,
    availableBeds: 2,
    availableICUBeds: 0,
    ambulancesAvailable: 1,
    currentLoad: 85,
    capacityStatus: "CRITICAL",
    acceptanceStatus: "PENDING",
    address: "789 GST Road, Chennai",
    simulationMode: true,
  },
];

const ambulances: Ambulance[] = [
  {
    ambulanceId: "AMB-12",
    crewId: "CREW-01",
    crewMembers: ["Dr. Priya Sharma", "Paramedic Ravi Kumar"],
    vehicleType: "Advanced Life Support",
    currentLocation: { lat: 13.091, lng: 80.251, address: "Near Chennai Central" },
    status: "READY",
    etaMinutes: 8,
    estimatedArrival: "10:39 AM",
    estimatedHospitalArrival: "10:52 AM",
    assignedIncidentId: "",
    dispatchTime: "",
    simulationMode: true,
  },
  {
    ambulanceId: "AMB-07",
    crewId: "CREW-02",
    crewMembers: ["Dr. Arun Patel", "Paramedic Suresh"],
    vehicleType: "Basic Life Support",
    currentLocation: { lat: 13.050, lng: 80.245, address: "Near T. Nagar" },
    status: "READY",
    etaMinutes: 12,
    estimatedArrival: "10:43 AM",
    estimatedHospitalArrival: "10:58 AM",
    assignedIncidentId: "",
    dispatchTime: "",
    simulationMode: true,
  },
  {
    ambulanceId: "AMB-03",
    crewId: "CREW-03",
    crewMembers: ["Dr. Meera Nair", "Paramedic John"],
    vehicleType: "Advanced Life Support",
    currentLocation: { lat: 13.078, lng: 80.180, address: "Near Airport" },
    status: "READY",
    etaMinutes: 15,
    estimatedArrival: "10:46 AM",
    estimatedHospitalArrival: "11:02 AM",
    assignedIncidentId: "",
    dispatchTime: "",
    simulationMode: true,
  },
];

const policeUnits: PoliceUnit[] = [
  {
    unitId: "POL-UNIT-01",
    unitType: "Traffic Patrol",
    officerName: "Inspector Kumar",
    etaMinutes: 5,
    eta: 5,
    status: "AVAILABLE",
    assignmentTime: "",
    simulationMode: true,
    currentLocation: { lat: 13.091, lng: 80.251, address: "Central District" },
  },
  {
    unitId: "POL-UNIT-02",
    unitType: "Highway Patrol",
    officerName: "SI Rajesh",
    etaMinutes: 8,
    eta: 8,
    status: "AVAILABLE",
    assignmentTime: "",
    simulationMode: true,
    currentLocation: { lat: 13.100, lng: 80.260, address: "Highway Base" },
  },
  {
    unitId: "POL-UNIT-03",
    unitType: "Investigation Unit",
    officerName: "Inspector Meena",
    etaMinutes: 12,
    eta: 12,
    status: "AVAILABLE",
    assignmentTime: "",
    simulationMode: true,
    currentLocation: { lat: 13.060, lng: 80.230, address: "North Sector" },
  },
  {
    unitId: "POL-UNIT-04",
    unitType: "Emergency Supervisor",
    officerName: "DSP Venkat",
    etaMinutes: 15,
    eta: 15,
    status: "AVAILABLE",
    assignmentTime: "",
    simulationMode: true,
    currentLocation: { lat: 13.120, lng: 80.210, address: "Command HQ" },
  },
];

const initialIncident: Incident = {
  incidentId: "INC-CHN-2401",
  createdAt: new Date(Date.now() - 11 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
  location: {
    lat: 13.0368,
    lng: 80.2084,
    address: "Kathipara Junction, GST Road, Chennai",
  },
  severity: "CRITICAL",
  riskScore: 88,
  confidence: 96,
  sources: ["AI Road Camera TN-04", "Citizen Report CR-7812", "Traffic Control Room"],
  sourceCount: 3,
  mergeStatus: "MERGED",
  timeline: [
    { timestamp: "23:41:08", event: "Collision detected", details: "AI camera classified a multi-vehicle collision", actor: "AI Detection" },
    { timestamp: "23:42:16", event: "Citizen report received", details: "Emergency call verified at Kathipara Junction", actor: "Citizen Report" },
    { timestamp: "23:43:02", event: "Incident created and merged", details: "Three reports consolidated into one response record", actor: "Command Center" },
    { timestamp: "23:44:19", event: "Hospital accepted case", details: "City Trauma Center prepared emergency intake", actor: "Hospital Coordination" },
    { timestamp: "23:45:11", event: "Ambulance dispatched", details: "Advanced Life Support unit AMB-12 en route", actor: "Ambulance Dispatch" },
    { timestamp: "23:46:04", event: "Police escort assigned", details: "Highway patrol cleared the response corridor", actor: "Police Control Room" },
  ],
  hospital: {
    ...hospitals[0],
    acceptanceStatus: "ACCEPTED",
    selectionReason: "Best trauma capacity and shortest response route",
    coordinationScore: 94,
  },
  ambulance: {
    ...ambulances[0],
    status: "EN_ROUTE",
    assignedIncidentId: "INC-CHN-2401",
    dispatchTime: "23:45:11",
    estimatedArrival: "23:53",
    estimatedHospitalArrival: "00:06",
  },
  police: [
    {
      ...policeUnits[1],
      status: "EN_ROUTE",
      etaMinutes: 6,
      eta: 6,
      incidentId: "INC-CHN-2401",
      assignmentTime: "23:46:04",
    },
  ],
  familyNotification: {
    status: "SENT_AND_ACKNOWLEDGED",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    method: "SMS + Voice Call",
  },
  coordinationStatus: "RESPONSE IN PROGRESS",
  simulationMode: true,
  completionStatus: "ACTIVE",
  blackboxId: "BB-CHN-2401",
  vehicleInvolved: "2 cars + 1 two-wheeler",
  casualties: 2,
  description: "Multi-vehicle collision on the Chennai GST Road corridor. Two casualties reported; emergency response is active and family liaison has acknowledged the notification.",
};

const secondIncident: Incident = {
  incidentId: "INC-CHN-2402",
  createdAt: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
  location: {
    lat: 13.0012,
    lng: 80.255,
    address: "OMR Tech Corridor, Sholinganallur, Chennai",
  },
  severity: "HIGH",
  riskScore: 74,
  confidence: 89,
  sources: ["AI Road Camera TN-21", "Traffic Control Room"],
  sourceCount: 2,
  mergeStatus: "SINGLE",
  timeline: [
    { timestamp: "23:46:40", event: "Vehicle collision reported", details: "Two vehicles impacted near OMR flyover", actor: "AI Detection" },
    { timestamp: "23:48:05", event: "Hospital coordination started", details: "Metro General Hospital initiated evaluation", actor: "Hospital Coordination" },
    { timestamp: "23:49:12", event: "Ambulance dispatched", details: "AMB-07 assigned with trauma support", actor: "Ambulance Dispatch" },
    { timestamp: "23:49:58", event: "Police unit dispatched", details: "Traffic patrol assigned to maintain safe corridor", actor: "Police Control Room" },
  ],
  hospital: {
    ...hospitals[1],
    acceptanceStatus: "ACCEPTED",
    selectionReason: "Trauma level 2 hospital with available ICU capacity",
    coordinationScore: 88,
  },
  ambulance: {
    ...ambulances[1],
    status: "EN_ROUTE",
    assignedIncidentId: "INC-CHN-2402",
    dispatchTime: "23:49:12",
    estimatedArrival: "23:57",
    estimatedHospitalArrival: "00:10",
  },
  police: [
    {
      ...policeUnits[0],
      status: "EN_ROUTE",
      etaMinutes: 4,
      eta: 4,
      incidentId: "INC-CHN-2402",
      assignmentTime: "23:49:58",
    },
  ],
  familyNotification: {
    status: "SENT",
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    method: "SMS",
  },
  coordinationStatus: "COORDINATION COMPLETED",
  simulationMode: true,
  completionStatus: "ACTIVE",
  blackboxId: "BB-CHN-2402",
  vehicleInvolved: "Sedan + SUV",
  casualties: 1,
  description: "Rear-end collision along the OMR corridor. Injury sustained on the passenger side; ambulance and traffic patrol are responding.",
};

const thirdIncident: Incident = {
  incidentId: "INC-CHN-2403",
  createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
  location: {
    lat: 13.0822,
    lng: 80.2718,
    address: "Anna Salai, Chennai Central, Chennai",
  },
  severity: "MODERATE",
  riskScore: 58,
  confidence: 81,
  sources: ["Traffic Monitoring Camera", "Citizen Report CR-9157"],
  sourceCount: 2,
  mergeStatus: "MERGED",
  timeline: [
    { timestamp: "23:51:30", event: "Signal violation reported", details: "Vehicle struck a divider near Anna Salai", actor: "Traffic Monitoring" },
    { timestamp: "23:52:15", event: "Care coordination initiated", details: "Minor injuries being triaged at the scene", actor: "Command Center" },
    { timestamp: "23:52:45", event: "Family update prepared", details: "Notification pending confirmation from control room", actor: "Family Desk" },
  ],
  hospital: {
    ...hospitals[0],
    acceptanceStatus: "PENDING",
    selectionReason: "Closest trauma facility with available beds",
    coordinationScore: 81,
  },
  ambulance: {
    ...ambulances[2],
    status: "READY",
    assignedIncidentId: "INC-CHN-2403",
    dispatchTime: "",
    estimatedArrival: "Pending",
    estimatedHospitalArrival: "Pending",
  },
  police: [
    {
      ...policeUnits[3],
      status: "AVAILABLE",
      etaMinutes: 9,
      eta: 9,
      incidentId: "INC-CHN-2403",
      assignmentTime: "",
    },
  ],
  familyNotification: {
    status: "PENDING",
    timestamp: "",
    method: "Call Center",
  },
  coordinationStatus: "INITIATED",
  simulationMode: true,
  completionStatus: "ACTIVE",
  blackboxId: "BB-CHN-2403",
  vehicleInvolved: "Auto-rickshaw + bike",
  casualties: 1,
  description: "Minor junction impact on Anna Salai. Emergency team evaluating injury severity and dispatching nearest responder support.",
};

let incidents: Incident[] = [initialIncident, secondIncident, thirdIncident];
let citizenReports: CitizenReport[] = [];

let settings: Settings = {
  hospitalCoordinationEnabled: true,
  ambulanceSimulationEnabled: true,
  citizenReportsEnabled: true,
  hospitalCapacitySimulationEnabled: true,
  policeUnitSimulationEnabled: true,
  incidentMergeThreshold: 500,
  hospitalSelectionStrategy: "weighted",
  etaSimulationEnabled: true,
  autoCoordinationEnabled: true,
  demoSpeed: 1,
  scoringWeights: {
    distance: 0.25,
    beds: 0.2,
    icu: 0.2,
    trauma: 0.15,
    load: 0.1,
    ambulance: 0.1,
  },
};

const generateId = (prefix: string): string => `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;
const getTimestamp = (): string => new Date().toLocaleTimeString();

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const normalize = (value: number, max: number): number => Math.max(0, Math.min(1, value / max));

const buildHospitalSelection = (incident: Incident): Hospital => {
  const scored = hospitals.map((hospital) => {
    const distance = calculateDistance(
      incident.location.lat,
      incident.location.lng,
      hospital.latitude,
      hospital.longitude,
    );

    const distanceScore = Math.max(0, 1 - distance / 20);
    const traumaScore = hospital.traumaLevel === 1 ? 1 : hospital.traumaLevel === 2 ? 0.7 : 0.4;
    const bedScore = normalize(hospital.availableBeds, 12);
    const icuScore = normalize(hospital.availableICUBeds, 5);
    const loadScore = 1 - hospital.currentLoad / 100;
    const ambulanceScore = normalize(hospital.ambulancesAvailable, 3);

    const weights = settings.scoringWeights || {
      distance: 0.25,
      beds: 0.2,
      icu: 0.2,
      trauma: 0.15,
      load: 0.1,
      ambulance: 0.1,
    };

    const totalScore =
      weights.distance * distanceScore +
      weights.beds * bedScore +
      weights.icu * icuScore +
      weights.trauma * traumaScore +
      weights.load * loadScore +
      weights.ambulance * ambulanceScore;

    return {
      hospital,
      score: totalScore,
      reason: `Distance ${distance.toFixed(1)} km, beds ${hospital.availableBeds}, ICU ${hospital.availableICUBeds}, trauma L${hospital.traumaLevel}`,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  const winner = scored[0];
  if (!winner) throw new Error('No hospital available');

  return {
    ...winner.hospital,
    coordinationScore: Number(winner.score.toFixed(3)),
    selectionReason: winner.reason,
  };
};

const selectBestHospital = (incident: Incident): Hospital => buildHospitalSelection(incident);

const resolveLocation = (location: any, fallbackAddress: string = 'Simulated Chennai Road') => {
  if (location && typeof location === 'object' && 'lat' in location && 'lng' in location) {
    return {
      lat: Number(location.lat),
      lng: Number(location.lng),
      address: location.address || fallbackAddress,
    };
  }

  const baseLat = 13.0827 + (Math.random() - 0.5) * 0.04;
  const baseLng = 80.2707 + (Math.random() - 0.5) * 0.04;

  return {
    lat: Number(baseLat.toFixed(4)),
    lng: Number(baseLng.toFixed(4)),
    address: typeof location === 'string' ? location : fallbackAddress,
  };
};

const createIncident = async (data: {
  location: { lat: number; lng: number; address: string };
  severity: string;
  riskScore?: number;
  confidence?: number;
  source: string;
  vehicleInvolved?: string;
  casualties?: number;
  description?: string;
}): Promise<Incident> => {
  const resolvedLocation = resolveLocation(data.location, data.location?.address || 'Simulated Chennai Road');
  const severity = data.severity || 'MODERATE';
  const riskScore = data.riskScore ?? 75;
  const confidence = data.confidence ?? 90;
  const vehicleInvolved = data.vehicleInvolved || 'Passenger Vehicle';
  const casualties = data.casualties ?? 1;
  const description = data.description || 'Collision reported by emergency system';

  const duplicate = incidents.find((inc) => {
    const distance = calculateDistance(
      inc.location.lat,
      inc.location.lng,
      resolvedLocation.lat,
      resolvedLocation.lng,
    );
    return distance < settings.incidentMergeThreshold / 1000 && inc.completionStatus !== 'COMPLETED';
  });

  if (duplicate) {
    duplicate.sources.push(data.source);
    duplicate.sourceCount = duplicate.sources.length;
    duplicate.confidence = Math.min(99, duplicate.confidence + 2);
    duplicate.mergeStatus = 'MERGED';
    duplicate.timeline.push({
      timestamp: getTimestamp(),
      event: `Report merged from ${data.source}`,
      details: `Additional report received for ${duplicate.incidentId}`,
      actor: 'System',
    });
    duplicate.updatedAt = new Date().toISOString();
    return duplicate;
  }

  const incidentId = generateId('INC');
  const now = new Date().toISOString();

  const incident: Incident = {
    incidentId,
    createdAt: now,
    updatedAt: now,
    location: resolvedLocation,
    severity,
    riskScore,
    confidence,
    sources: [data.source],
    sourceCount: 1,
    mergeStatus: 'SINGLE',
    timeline: [
      {
        timestamp: getTimestamp(),
        event: 'Collision detected',
        details: `AI or citizen report identified a collision at ${resolvedLocation.address}`,
        actor: 'Detection Service',
      },
      {
        timestamp: getTimestamp(),
        event: `Severity classified: ${severity}`,
        details: `Risk score: ${riskScore}`,
        actor: 'Risk Engine',
      },
      {
        timestamp: getTimestamp(),
        event: `Incident created: ${incidentId}`,
        details: `GPS coordinates: ${resolvedLocation.lat}, ${resolvedLocation.lng}`,
        actor: 'System',
      },
    ],
    hospital: null,
    ambulance: null,
    police: [],
    familyNotification: {
      status: 'PENDING',
      timestamp: '',
      method: 'SIMULATED',
    },
    coordinationStatus: 'INITIATED',
    simulationMode: true,
    completionStatus: 'IN_PROGRESS',
    blackboxId: `BB-${incidentId.split('-')[1]}`,
    vehicleInvolved,
    casualties,
    description,
  };

  incidents.push(incident);

  if (settings.autoCoordinationEnabled) {
    await coordinateIncident(incident);
  }

  return incident;
};

const coordinateIncident = async (incident: Incident): Promise<void> => {
  if (settings.hospitalCoordinationEnabled) {
    const selectedHospital = selectBestHospital(incident);
    const hospitalCandidates = hospitals
      .map((hospital) => ({ ...hospital, coordinationScore: Number((buildHospitalSelection(incident).coordinationScore ?? 0).toFixed(3)), selectionReason: `Scored ${hospital.hospitalName}` }))
      .sort((a, b) => (b.coordinationScore ?? 0) - (a.coordinationScore ?? 0));

    incident.hospitalCandidates = hospitalCandidates;
    incident.hospital = { ...selectedHospital, acceptanceStatus: 'PENDING' };
    incident.hospitalScore = Number((selectedHospital.coordinationScore ?? 0).toFixed(3));
    incident.timeline.push({
      timestamp: getTimestamp(),
      event: 'Hospital selected',
      details: `${selectedHospital.hospitalName} selected with score ${incident.hospitalScore}`,
      actor: 'Hospital Coordination Service',
    });

    const hospitalAccepts = incident.severity === 'LOW' || incident.severity === 'MODERATE' ? true : true;
    if (hospitalAccepts) {
      incident.hospital.acceptanceStatus = 'ACCEPTED';
      incident.timeline.push({
        timestamp: getTimestamp(),
        event: 'Hospital accepted case',
        details: `${selectedHospital.hospitalName} accepted the emergency case`,
        actor: selectedHospital.hospitalName,
      });
    } else {
      incident.hospital.acceptanceStatus = 'REJECTED';
      incident.timeline.push({
        timestamp: getTimestamp(),
        event: 'Hospital rejected case',
        details: `${selectedHospital.hospitalName} rejected the case`,
        actor: selectedHospital.hospitalName,
      });
    }
  }

  if (settings.ambulanceSimulationEnabled && incident.hospital?.acceptanceStatus === 'ACCEPTED') {
    const availableAmbulance = ambulances.find((amb) => amb.status === 'READY');
    if (availableAmbulance) {
      const etaMinutes = 7 + Math.max(2, Math.round((Math.random() * 10) + 4));
      const assignedAmbulance = {
        ...availableAmbulance,
        status: 'EN_ROUTE',
        etaMinutes,
        estimatedArrival: `${new Date(Date.now() + etaMinutes * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        estimatedHospitalArrival: `${new Date(Date.now() + (etaMinutes + 10) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        assignedIncidentId: incident.incidentId,
        dispatchTime: new Date().toISOString(),
      };

      availableAmbulance.status = 'ASSIGNED';
      availableAmbulance.assignedIncidentId = incident.incidentId;
      availableAmbulance.dispatchTime = new Date().toISOString();
      incident.ambulance = assignedAmbulance;
      incident.timeline.push({
        timestamp: getTimestamp(),
        event: `Ambulance ${availableAmbulance.ambulanceId} assigned`,
        details: `Crew: ${availableAmbulance.crewMembers.join(', ')} | ETA: ${etaMinutes} min`,
        actor: 'Ambulance Dispatch Service',
      });
    }
  }

  if (settings.policeUnitSimulationEnabled) {
    const severityUnits: Record<string, string[]> = {
      LOW: ['Traffic Patrol'],
      MODERATE: ['Traffic Patrol'],
      HIGH: ['Traffic Patrol', 'Highway Patrol'],
      CRITICAL: ['Traffic Patrol', 'Highway Patrol', 'Investigation Unit'],
      CATASTROPHIC: ['Traffic Patrol', 'Highway Patrol', 'Investigation Unit', 'Emergency Supervisor'],
    };

    const requiredUnits = severityUnits[incident.severity] || severityUnits.MODERATE;
    const assignedUnits = policeUnits
      .filter((unit) => requiredUnits.includes(unit.unitType) && unit.status === 'AVAILABLE')
      .map((unit, index) => ({
        ...unit,
        eta: unit.etaMinutes || 5 + index,
        status: 'EN_ROUTE',
        assignmentTime: new Date().toISOString(),
      }));

    incident.police = assignedUnits;
    incident.timeline.push({
      timestamp: getTimestamp(),
      event: 'Police units assigned',
      details: `${assignedUnits.length} police resources dispatched based on severity`,
      actor: 'Police Coordination Service',
    });
  }

  incident.familyNotification = {
    status: 'SIMULATED_NOTIFICATION_SENT',
    timestamp: new Date().toISOString(),
    method: 'SIMULATED',
  };
  incident.timeline.push({
    timestamp: getTimestamp(),
    event: 'Family notification simulated',
    details: 'Notification sent in simulation mode only',
    actor: 'Notification Engine',
  });

  incident.coordinationStatus = 'COORDINATION_IN_PROGRESS';
  incident.updatedAt = new Date().toISOString();
};

const createCitizenReport = async (data: {
  location: string | { lat: number; lng: number; address?: string };
  description: string;
  severity?: string;
  source?: string;
  type?: string;
  callerName?: string;
  phoneNumber?: string;
}): Promise<CitizenReport> => {
  if (!data.description || !data.description.trim()) {
    throw new Error('Invalid citizen report');
  }

  const resolvedLocation = resolveLocation(data.location, 'Citizen Report Location');
  const report: CitizenReport = {
    reportId: generateId('CR'),
    callerId: generateId('CIT'),
    location: resolvedLocation,
    description: data.description,
    callerName: data.callerName || 'Citizen Reporter',
    phoneNumber: data.phoneNumber || 'SIM-000000',
    timestamp: new Date().toISOString(),
    confidence: 91,
    severity: data.severity || 'MODERATE',
    status: 'RECEIVED',
    simulationMode: true,
  };

  citizenReports.push(report);

  if (!settings.citizenReportsEnabled) return report;

  const matchingIncident = incidents.find((inc) => {
    const distance = calculateDistance(
      inc.location.lat,
      inc.location.lng,
      resolvedLocation.lat,
      resolvedLocation.lng,
    );
    return distance < settings.incidentMergeThreshold / 1000;
  });

  if (matchingIncident) {
    matchingIncident.sources.push('Citizen');
    matchingIncident.sourceCount = matchingIncident.sources.length;
    matchingIncident.confidence = Math.min(99, matchingIncident.confidence + 4);
    matchingIncident.mergeStatus = 'MERGED';
    matchingIncident.timeline.push({
      timestamp: getTimestamp(),
      event: 'Citizen report merged',
      details: `Report ${report.reportId} merged into ${matchingIncident.incidentId}`,
      actor: 'Incident Merge Service',
    });
    report.incidentId = matchingIncident.incidentId;
    report.status = 'MERGED';
    report.mergedInto = matchingIncident.incidentId;
    return report;
  }

  const created = await createIncident({
    location: resolvedLocation,
    severity: data.severity || 'MODERATE',
    riskScore: 76,
    confidence: 92,
    source: data.source || 'Citizen',
    vehicleInvolved: 'Passenger Vehicle',
    casualties: 1,
    description: data.description,
  });

  report.incidentId = created.incidentId;
  report.status = 'CREATED_INCIDENT';
  return report;
};

const submitCitizenReport = async (data: any): Promise<CitizenReport> => createCitizenReport(data);

const getActiveIncidents = async (): Promise<Incident[]> => incidents.filter((inc) => inc.completionStatus === 'IN_PROGRESS');
const getAllIncidents = async (): Promise<Incident[]> => incidents;
const getSettings = async (): Promise<Settings> => settings;
const saveSettings = async (newSettings: Settings): Promise<Settings> => {
  settings = { ...settings, ...newSettings };
  return settings;
};
const updateSettings = async (newSettings: Settings): Promise<Settings> => saveSettings(newSettings);

const updateIncident = async (updatedIncident: Incident): Promise<Incident> => {
  const index = incidents.findIndex((inc) => inc.incidentId === updatedIncident.incidentId);
  if (index >= 0) {
    incidents[index] = updatedIncident;
    return updatedIncident;
  }
  incidents.push(updatedIncident);
  return updatedIncident;
};

const resetSystem = async (): Promise<void> => {
  incidents = [];
  citizenReports = [];
  hospitals.forEach((hospital) => {
    hospital.acceptanceStatus = 'PENDING';
    hospital.capacityStatus = 'AVAILABLE';
    hospital.coordinationScore = undefined;
    hospital.selectionReason = undefined;
  });
  ambulances.forEach((amb) => {
    amb.status = 'READY';
    amb.assignedIncidentId = '';
    amb.dispatchTime = '';
  });
  policeUnits.forEach((unit) => {
    unit.status = 'AVAILABLE';
    unit.assignmentTime = '';
  });
};

const resetDemo = async (): Promise<void> => {
  await resetSystem();
};

const getHospitals = async (): Promise<Hospital[]> => hospitals;
const getAmbulances = async (): Promise<Ambulance[]> => ambulances;
const getPoliceUnits = async (): Promise<PoliceUnit[]> => policeUnits;
const getCitizenReports = async (): Promise<CitizenReport[]> => citizenReports;

const getCoordination = async (incidentId: string): Promise<Incident | null> => incidents.find((inc) => inc.incidentId === incidentId) || null;
const getAmbulanceByIncidentId = async (incidentId: string): Promise<Ambulance | null> => {
  const incident = incidents.find((inc) => inc.incidentId === incidentId);
  return incident?.ambulance || null;
};
const getPoliceByIncidentId = async (incidentId: string): Promise<PoliceUnit[]> => {
  const incident = incidents.find((inc) => inc.incidentId === incidentId);
  return incident?.police || [];
};

export const emergencyService = {
  createIncident,
  createCitizenReport,
  submitCitizenReport,
  getActiveIncidents,
  getAllIncidents,
  getSettings,
  saveSettings,
  updateSettings,
  updateIncident,
  resetSystem,
  resetDemo,
  getHospitals,
  getAmbulances,
  getPoliceUnits,
  getCitizenReports,
  getCoordination,
  getAmbulanceByIncidentId,
  getPoliceByIncidentId,
};