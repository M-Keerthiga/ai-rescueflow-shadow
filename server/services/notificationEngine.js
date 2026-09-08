/**
 * AI RESCUEFLOW SHADOW — Notification Engine
 * Phase B Notification Service coordinating simulated multi-channel notifications.
 * Channels: SMS, PHONE, EMAIL, PUSH for all recipients (Family, Hospital, Police).
 * 
 * STRICT REQUIREMENT:
 * The entire implementation MUST operate in SIMULATION MODE.
 * Never contact any real emergency services or external endpoints.
 * 
 * MANDATORY DISCLAIMER:
 * SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { deduplicationService } from './deduplicationService.js';
import { orchestrateEmergencyResponse, isCollisionConfirmed } from './emergencyResponseOrchestrator.js';
import { formatFamilyNotifications } from './notification/familyAdapter.js';
import { formatHospitalNotifications } from './notification/hospitalAdapter.js';
import { formatPoliceNotifications } from './notification/policeAdapter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const SIMULATION_DISCLAIMER = 'SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED';

export const NOTIFICATION_STATUS = {
  QUEUED: 'QUEUED',
  GENERATED: 'GENERATED',
  SIMULATED_SENT: 'SIMULATED_SENT',
  SKIPPED_DUPLICATE: 'SKIPPED_DUPLICATE',
  FAILED: 'FAILED',
  RETRYING: 'RETRYING'
};

export const INCIDENT_STATUS = {
  CREATED: 'CREATED',
  ORCHESTRATED: 'ORCHESTRATED',
  NOTIFICATIONS_GENERATED: 'NOTIFICATIONS_GENERATED',
  DISPATCH_PLANNED: 'DISPATCH_PLANNED',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

export const NOTIFICATION_CHANNELS = {
  SMS: 'SMS',
  PHONE: 'PHONE',
  EMAIL: 'EMAIL',
  PUSH: 'PUSH'
};

export const RECIPIENT_TYPES = {
  FAMILY: 'FAMILY',
  HOSPITAL: 'HOSPITAL',
  POLICE: 'POLICE'
};

const hospitalsPath = path.join(__dirname, '../data/hospitals.json');
const policeStationsPath = path.join(__dirname, '../data/policeStations.json');

function loadJsonSafe(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return [];
  }
}

/**
 * Deterministically derives injury estimates based on severity level and crash physics.
 */
export function deriveEstimatedInjuries(severity, telemetry = {}) {
  const norm = String(severity || '').toUpperCase().trim();
  const gForce = telemetry.gForceVehicleB || telemetry.gForce || telemetry.g_force_b || 10;
  
  switch (norm) {
    case 'LOW':
      return '0 critical injuries; 1-2 minor shock/bruises reported';
    case 'MODERATE':
      return '1 moderate injury (whiplash/contusions); 0 life-threatening';
    case 'HIGH':
      return `2-3 significant injuries (impact g-force: ${gForce}G); extrication standby requested`;
    case 'CRITICAL':
      return `3-4 severe injuries (severe head trauma/polytrauma); immediate ALS Level 1 resuscitation required`;
    case 'CATASTROPHIC':
      return `Multiple critical/life-threatening trauma casualties (extreme g-force: ${gForce}G); mass casualty triage initiated`;
    default:
      return '1 moderate injury (whiplash/contusions); 0 life-threatening';
  }
}

/**
 * Deterministically derives recommended operational response based on severity level.
 */
export function deriveRecommendedResponse(severity, policyRecipients = []) {
  const norm = String(severity || '').toUpperCase().trim();
  const recipientList = policyRecipients.length > 0 ? policyRecipients.join(', ') : 'Assigned Emergency Agencies';

  switch (norm) {
    case 'LOW':
      return `Standard family advisory notification (${recipientList}); monitor vehicle occupants vitals`;
    case 'MODERATE':
      return `Dispatch BLS ambulance for medical evaluation; notify hospital triage and family contacts (${recipientList})`;
    case 'HIGH':
      return `Dispatch ALS ambulance and police traffic patrol; prepare trauma bay; notify family (${recipientList})`;
    case 'CRITICAL':
      return `Immediate highest priority Level 1 trauma dispatch; rapid corridor lockdown; immediate family alert (${recipientList})`;
    case 'CATASTROPHIC':
      return `Immediate highest priority multi-agency emergency response; full perimeter lockdown; priority trauma intake (${recipientList})`;
    default:
      return `Elevated response priority dispatch to: ${recipientList}`;
  }
}

/**
 * Formats a clean vehicle description string.
 */
export function deriveVehicleString(incidentData = {}) {
  if (typeof incidentData.vehicle === 'string' && incidentData.vehicle.trim().length > 0) {
    return incidentData.vehicle;
  }
  if (incidentData.vehiclesInvolved && Array.isArray(incidentData.vehiclesInvolved)) {
    return incidentData.vehiclesInvolved
      .map(v => v.type || v.id || v.name || 'Vehicle')
      .join(' & ');
  }
  const vehA = incidentData.vehicleA?.type || incidentData.telemetry?.vehicleA?.type || 'BUS #7 (College Bus)';
  const vehB = incidentData.vehicleB?.type || incidentData.telemetry?.vehicleB?.type || 'CAR #12 (Ola Sedan)';
  return `${vehA} & ${vehB}`;
}

/**
 * NotificationEngine Class
 * Manages separate in-memory structures:
 * - notificationHistory
 * - incidentHistory
 * - dispatchHistory
 */
export class NotificationEngine {
  constructor() {
    this._notifCounter = 0;

    // Separate in-memory storage structures
    this.notificationHistory = []; // Array of individual notification records
    this.incidentHistory = new Map(); // Key: incidentId -> incident summary & records
    this.dispatchHistory = new Map(); // Key: `${incidentId}::${recipientKey}` -> dispatch record
  }

  /**
   * Generates a stable, formatted notification ID: e.g. "NOTIF-000123"
   */
  nextNotificationId() {
    this._notifCounter += 1;
    return `NOTIF-${String(this._notifCounter).padStart(6, '0')}`;
  }

  /**
   * Resets all history stores and ID counter (useful for clean test environments)
   */
  reset() {
    this._notifCounter = 0;
    this.notificationHistory = [];
    this.incidentHistory.clear();
    this.dispatchHistory.clear();
    deduplicationService.clearRecords();
  }

  /**
   * Main dispatch method: Orchestrates and dispatches simulated multi-channel notifications.
   * Prevents duplicate notifications per incident and recipient.
   * Returns combined orchestrator summary + notifications + channel summary + timeline.
   * 
   * @param {Object} payload - Incident data, orchestrator plan, or telemetry
   * @returns {Object} Full notification and orchestration payload
   */
  notify(payload = {}) {
    const startTime = Date.now();
    const timelineEvents = [];

    // Stage 1: Collision Verification & Incident Input Intake
    const t1Start = Date.now();
    let orchestrationResult;
    let incidentId;
    let severity = 'MODERATE';

    if (payload.activated !== undefined && payload.dispatchPlan !== undefined) {
      // Input is already an orchestrator result
      orchestrationResult = payload;
      incidentId = payload.incidentId || `INC-SIM-${Date.now().toString().slice(-6)}`;
      severity = payload.severity || 'MODERATE';
    } else {
      // Validate collision and run orchestrator
      const confirmed = isCollisionConfirmed(payload);
      if (!confirmed) {
        return {
          activated: false,
          incidentId: payload?.incidentId || null,
          status: 'BLOCKED_COLLISION_NOT_CONFIRMED',
          incidentStatus: INCIDENT_STATUS.FAILED,
          currentStatus: NOTIFICATION_STATUS.FAILED,
          dispatchStatus: 'ABORTED_UNCONFIRMED_COLLISION',
          notifications: [],
          notificationHistory: [],
          recipients: [],
          retryCount: 0,
          channelSummary: { SMS: 0, PHONE: 0, EMAIL: 0, PUSH: 0, TOTAL: 0 },
          recipientSummary: { FAMILY: 0, HOSPITAL: 0, POLICE: 0, TOTAL: 0 },
          timeline: [
            {
              stage: 'INCIDENT_VERIFICATION',
              timestamp: new Date().toISOString(),
              durationMs: Date.now() - t1Start,
              status: NOTIFICATION_STATUS.FAILED,
              detail: 'Collision not confirmed by RescueFlow Severity Engine.'
            }
          ],
          simulationDisclaimer: SIMULATION_DISCLAIMER
        };
      }

      orchestrationResult = orchestrateEmergencyResponse(payload);
      incidentId = orchestrationResult.incidentId;
      severity = orchestrationResult.severity || 'MODERATE';
    }

    timelineEvents.push({
      stage: 'INCIDENT_VERIFIED',
      timestamp: new Date(t1Start).toISOString(),
      durationMs: Date.now() - t1Start,
      status: 'COMPLETED',
      detail: `Impact confirmed for incident ${incidentId} with severity ${severity}.`
    });

    // Stage 2: Location & Incident Context Derivation
    const t2Start = Date.now();
    const gps = orchestrationResult.location?.GPS || payload.gps || payload.GPS || '37.774900, -122.419400';
    const vehicle = payload.vehicle || deriveVehicleString(payload);
    const estimatedInjuries = payload.estimatedInjuries || deriveEstimatedInjuries(severity, payload.telemetry || payload);
    const policyRecipients = orchestrationResult.metadata?.policyApplied || orchestrationResult.dispatchPlan?.map(d => d.recipientType) || ['Family', 'Hospital'];
    const recommendedResponse = payload.recommendedResponse || deriveRecommendedResponse(severity, policyRecipients);
    const nowIso = new Date().toISOString();

    timelineEvents.push({
      stage: 'CONTEXT_DERIVATION',
      timestamp: new Date(t2Start).toISOString(),
      durationMs: Date.now() - t2Start,
      status: 'COMPLETED',
      detail: `Resolved GPS: ${gps}, Vehicles: ${vehicle}, Injuries: ${estimatedInjuries}.`
    });

    // Stage 3: Deduplication & Recipient Resolution
    const t3Start = Date.now();
    const recipientRecords = [];
    const newNotifications = [];
    let totalRetriesForIncident = 0;

    const selectedHospital = orchestrationResult.selectedHospital;
    const selectedPoliceStation = orchestrationResult.selectedPoliceStation;
    const familyRecipients = orchestrationResult.familyRecipients || [];

    // Helper to evaluate and dispatch a recipient group
    const processRecipient = (recipientType, recipientObj, formatAdapterFn, extraContext = {}) => {
      const recipientId = recipientObj?.id || `${recipientType}-PRIMARY`;
      const recipientKey = `${incidentId}::${recipientId}`;

      // Check deduplication
      const existingDispatch = this.dispatchHistory.get(recipientKey);
      
      if (existingDispatch && existingDispatch.status === NOTIFICATION_STATUS.SIMULATED_SENT) {
        // Duplicate notification attempt: block duplicate sending, increment retryCount
        existingDispatch.retryCount += 1;
        existingDispatch.lastAttempt = new Date().toISOString();
        existingDispatch.status = NOTIFICATION_STATUS.SKIPPED_DUPLICATE;
        totalRetriesForIncident += 1;

        recipientRecords.push({
          recipientType,
          recipientId,
          recipientName: recipientObj?.name || recipientId,
          status: NOTIFICATION_STATUS.SKIPPED_DUPLICATE,
          retryCount: existingDispatch.retryCount,
          channels: [],
          detail: 'Skipped duplicate dispatch. Recipient already notified for this incident.'
        });
        return;
      }

      // First time sending for this recipient on this incident:
      const dispatchRecord = {
        incidentId,
        recipientType,
        recipientId,
        recipientName: recipientObj?.name || recipientId,
        retryCount: 1,
        firstAttempt: nowIso,
        lastAttempt: nowIso,
        status: NOTIFICATION_STATUS.SIMULATED_SENT
      };
      this.dispatchHistory.set(recipientKey, dispatchRecord);

      // Generate all 4 simulated channels via adapter
      const idGen = () => this.nextNotificationId();
      const channels = formatAdapterFn({
        incidentId,
        severity,
        gps,
        vehicle,
        estimatedInjuries,
        timestamp: nowIso,
        recommendedResponse,
        recipient: recipientObj,
        idGenerator: idGen,
        status: NOTIFICATION_STATUS.SIMULATED_SENT,
        ...extraContext
      });

      // Append to separate notificationHistory
      for (const notif of channels) {
        this.notificationHistory.push(notif);
        newNotifications.push(notif);
      }

      recipientRecords.push({
        recipientType,
        recipientId,
        recipientName: recipientObj?.name || recipientId,
        status: NOTIFICATION_STATUS.SIMULATED_SENT,
        retryCount: 1,
        channelsDispatched: channels.map(c => ({
          notificationId: c.notificationId,
          channel: c.channel,
          status: c.status
        }))
      });
    };

    // 1. Process Family Recipients
    if (Array.isArray(familyRecipients)) {
      for (const fam of familyRecipients) {
        processRecipient(RECIPIENT_TYPES.FAMILY, fam, formatFamilyNotifications, {
          hospital: selectedHospital
        });
      }
    }

    // 2. Process Hospital (if in policy)
    if (selectedHospital && orchestrationResult.dispatchPlan?.some(d => d.recipientType === 'Hospital')) {
      processRecipient(RECIPIENT_TYPES.HOSPITAL, selectedHospital, formatHospitalNotifications, {
        telemetry: payload.telemetry || payload
      });
    }

    // 3. Process Police (if in policy)
    if (selectedPoliceStation && orchestrationResult.dispatchPlan?.some(d => d.recipientType === 'Police')) {
      processRecipient(RECIPIENT_TYPES.POLICE, selectedPoliceStation, formatPoliceNotifications, {
        location: orchestrationResult.location
      });
    }

    timelineEvents.push({
      stage: 'DEDUPLICATION_AND_DISPATCH',
      timestamp: new Date(t3Start).toISOString(),
      durationMs: Date.now() - t3Start,
      status: 'COMPLETED',
      detail: `Processed ${recipientRecords.length} recipients. Generated ${newNotifications.length} simulated notifications.`
    });

    // Stage 4: Channel & Recipient Summaries & Status Aggregation
    const t4Start = Date.now();
    const channelSummary = {
      SMS: 0,
      PHONE: 0,
      EMAIL: 0,
      PUSH: 0,
      TOTAL: newNotifications.length
    };

    for (const notif of newNotifications) {
      if (channelSummary[notif.channel] !== undefined) {
        channelSummary[notif.channel] += 1;
      }
    }

    const recipientSummary = {
      FAMILY: 0,
      HOSPITAL: 0,
      POLICE: 0,
      TOTAL: recipientRecords.length
    };

    for (const rec of recipientRecords) {
      const typeKey = String(rec.recipientType || '').toUpperCase();
      if (recipientSummary[typeKey] !== undefined) {
        recipientSummary[typeKey] += 1;
      }
    }

    const hasSent = newNotifications.length > 0;
    const hasDuplicates = recipientRecords.some(r => r.status === NOTIFICATION_STATUS.SKIPPED_DUPLICATE);
    
    let dispatchStatus = 'ALL_CHANNELS_DISPATCHED_SIMULATED';
    let currentStatus = NOTIFICATION_STATUS.SIMULATED_SENT;
    const incidentStatus = INCIDENT_STATUS.COMPLETED;

    if (!hasSent && hasDuplicates) {
      dispatchStatus = 'ALL_RECIPIENTS_SKIPPED_DUPLICATE';
      currentStatus = NOTIFICATION_STATUS.SKIPPED_DUPLICATE;
    } else if (hasSent && hasDuplicates) {
      dispatchStatus = 'PARTIAL_DISPATCH_DUPLICATES_SUPPRESSED';
      currentStatus = NOTIFICATION_STATUS.SIMULATED_SENT;
    }

    timelineEvents.push({
      stage: 'ORCHESTRATION_COMPLETED',
      timestamp: new Date(t4Start).toISOString(),
      durationMs: Date.now() - t4Start,
      status: 'COMPLETED',
      detail: `Dispatch status: ${dispatchStatus}. Incident status: ${incidentStatus}. Channel dispatches: ${channelSummary.TOTAL} total across ${recipientSummary.TOTAL} recipients.`
    });

    // Store in incidentHistory
    const incidentRecord = {
      incidentId,
      timestamp: nowIso,
      severity,
      gps,
      vehicle,
      estimatedInjuries,
      recommendedResponse,
      incidentStatus,
      dispatchStatus,
      currentStatus,
      retryCount: totalRetriesForIncident,
      channelSummary,
      recipientSummary,
      recipients: recipientRecords,
      notificationIds: newNotifications.map(n => n.notificationId),
      timeline: timelineEvents,
      orchestrationSummary: {
        responsePriority: orchestrationResult.responsePriority,
        selectedHospital: orchestrationResult.selectedHospital?.name || null,
        selectedPoliceStation: orchestrationResult.selectedPoliceStation?.name || null,
        dispatchPlanCount: orchestrationResult.dispatchPlan?.length || 0
      },
      simulationDisclaimer: SIMULATION_DISCLAIMER
    };

    this.incidentHistory.set(incidentId, incidentRecord);

    // Return combined orchestration and notification response
    return {
      incidentId,
      severity,
      gps,
      vehicle,
      estimatedInjuries,
      recommendedResponse,
      incidentStatus,
      dispatchPlan: orchestrationResult.dispatchPlan || [],
      dispatchStatus,
      recipients: recipientRecords,
      currentStatus,
      retryCount: totalRetriesForIncident,
      channelSummary,
      recipientSummary,
      notifications: newNotifications,
      notificationHistory: newNotifications, // Backwards compatible alias
      timeline: timelineEvents,
      orchestratorSummary: incidentRecord.orchestrationSummary,
      simulationDisclaimer: SIMULATION_DISCLAIMER
    };
  }

  /**
   * Retrieves notification status and details for a specific incident.
   * 
   * @param {string} incidentId
   * @returns {Object}
   */
  getStatus(incidentId) {
    const incidentRecord = this.incidentHistory.get(String(incidentId));

    if (!incidentRecord) {
      return {
        found: false,
        incidentId,
        incidentStatus: INCIDENT_STATUS.FAILED,
        currentStatus: NOTIFICATION_STATUS.FAILED,
        dispatchStatus: 'INCIDENT_NOT_FOUND',
        recipients: [],
        retryCount: 0,
        channelSummary: { SMS: 0, PHONE: 0, EMAIL: 0, PUSH: 0, TOTAL: 0 },
        recipientSummary: { FAMILY: 0, HOSPITAL: 0, POLICE: 0, TOTAL: 0 },
        notifications: [],
        timeline: [],
        simulationDisclaimer: SIMULATION_DISCLAIMER
      };
    }

    // Retrieve full notification items for this incident from notificationHistory
    const incidentNotifications = this.notificationHistory.filter(n => n.incidentId === incidentId);

    return {
      found: true,
      incidentId: incidentRecord.incidentId,
      timestamp: incidentRecord.timestamp,
      severity: incidentRecord.severity,
      gps: incidentRecord.gps,
      vehicle: incidentRecord.vehicle,
      estimatedInjuries: incidentRecord.estimatedInjuries,
      recommendedResponse: incidentRecord.recommendedResponse,
      incidentStatus: incidentRecord.incidentStatus || INCIDENT_STATUS.COMPLETED,
      currentStatus: incidentRecord.currentStatus,
      dispatchStatus: incidentRecord.dispatchStatus,
      recipients: incidentRecord.recipients,
      retryCount: incidentRecord.retryCount,
      channelSummary: incidentRecord.channelSummary,
      recipientSummary: incidentRecord.recipientSummary || { FAMILY: 0, HOSPITAL: 0, POLICE: 0, TOTAL: 0 },
      notifications: incidentNotifications,
      timeline: incidentRecord.timeline,
      simulationDisclaimer: SIMULATION_DISCLAIMER
    };
  }

  /**
   * Retrieves the full notification history across all incidents.
   * 
   * @returns {Object}
   */
  getHistory() {
    const channelSummary = {
      SMS: 0,
      PHONE: 0,
      EMAIL: 0,
      PUSH: 0,
      TOTAL: this.notificationHistory.length
    };

    for (const notif of this.notificationHistory) {
      if (channelSummary[notif.channel] !== undefined) {
        channelSummary[notif.channel] += 1;
      }
    }

    const recipientSummary = {
      FAMILY: 0,
      HOSPITAL: 0,
      POLICE: 0,
      TOTAL: 0
    };

    for (const inc of this.incidentHistory.values()) {
      if (inc.recipientSummary) {
        recipientSummary.FAMILY += inc.recipientSummary.FAMILY || 0;
        recipientSummary.HOSPITAL += inc.recipientSummary.HOSPITAL || 0;
        recipientSummary.POLICE += inc.recipientSummary.POLICE || 0;
        recipientSummary.TOTAL += inc.recipientSummary.TOTAL || 0;
      }
    }

    return {
      totalNotifications: this.notificationHistory.length,
      totalIncidentsRecorded: this.incidentHistory.size,
      channelSummary,
      recipientSummary,
      notificationHistory: [...this.notificationHistory],
      incidentHistory: Array.from(this.incidentHistory.values()),
      dispatchHistory: Array.from(this.dispatchHistory.values()),
      simulationDisclaimer: SIMULATION_DISCLAIMER
    };
  }

  /**
   * Returns list of emergency facilities (hospitals and police stations) from dataset.
   * 
   * @param {Object} [coords] - Optional coordinates { latitude, longitude }
   * @returns {Object}
   */
  getEmergencyServices(coords = null) {
    const hospitals = loadJsonSafe(hospitalsPath);
    const policeStations = loadJsonSafe(policeStationsPath);

    return {
      totalServices: hospitals.length + policeStations.length,
      hospitals: hospitals.map(h => ({
        ...h,
        supportedChannels: ['SMS', 'PHONE', 'EMAIL', 'PUSH'],
        simulationMode: true
      })),
      policeStations: policeStations.map(p => ({
        ...p,
        supportedChannels: ['SMS', 'PHONE', 'EMAIL', 'PUSH'],
        simulationMode: true
      })),
      simulationDisclaimer: SIMULATION_DISCLAIMER
    };
  }
}

export const notificationEngine = new NotificationEngine();
export default notificationEngine;
