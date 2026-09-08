/**
 * AI RESCUEFLOW SHADOW — Hospital Notification Adapter
 * Generates simulated multi-channel notifications for hospitals, trauma centers, and emergency intake.
 * Channels supported: SMS, PHONE, EMAIL, PUSH.
 * 
 * STRICT REQUIREMENT:
 * The entire implementation MUST operate in SIMULATION MODE.
 * Never contact any real emergency services or medical facilities.
 * 
 * MANDATORY DISCLAIMER:
 * SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED
 */

export const SIMULATION_DISCLAIMER = 'SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED';

export const NOTIFICATION_CHANNELS = {
  SMS: 'SMS',
  PHONE: 'PHONE',
  EMAIL: 'EMAIL',
  PUSH: 'PUSH'
};

export const RECIPIENT_TYPE = 'HOSPITAL';

/**
 * Formats simulated notifications across all 4 channels for a hospital facility.
 * 
 * @param {Object} params
 * @param {string} params.incidentId - Unique incident identifier
 * @param {string} params.severity - Severity level (LOW, MODERATE, HIGH, CRITICAL, CATASTROPHIC)
 * @param {string} params.gps - GPS coordinates string
 * @param {string} params.vehicle - Vehicle details string
 * @param {string} params.estimatedInjuries - Injury estimate summary
 * @param {string} params.timestamp - Incident / notification timestamp
 * @param {string} params.recommendedResponse - Recommended operational response
 * @param {Object} params.recipient - Hospital facility record { id, name, phone, email, priority, etaMinutes }
 * @param {Object} [params.telemetry] - Telemetry or impact analysis data
 * @param {Function} params.idGenerator - Function returning next stable notification ID (e.g. "NOTIF-000123")
 * @param {string} [params.status='SIMULATED_SENT'] - Standard notification status enum
 * @returns {Array<Object>} List of 4 channel notification records
 */
export function formatHospitalNotifications({
  incidentId,
  severity,
  gps,
  vehicle,
  estimatedInjuries,
  timestamp,
  recommendedResponse,
  recipient,
  telemetry,
  idGenerator,
  status = 'SIMULATED_SENT'
}) {
  const notifTimestamp = timestamp || new Date().toISOString();
  const hospitalName = recipient?.name || 'Emergency Trauma Center';
  const hospitalPhone = recipient?.phone || '+1-555-019-4821';
  const hospitalEmail = recipient?.email || 'trauma.intake@hospital.demo';
  const hospitalId = recipient?.id || 'HOSP-GEN-01';
  const etaMinutes = recipient?.etaMinutes || 4;
  const traumaLevel = recipient?.priority || (severity === 'CRITICAL' || severity === 'CATASTROPHIC' ? 'LEVEL_1_TRAUMA' : 'LEVEL_2_TRAUMA');

  const baseNotification = {
    incidentId,
    severity,
    gps,
    vehicle,
    estimatedInjuries,
    timestamp: notifTimestamp,
    recommendedResponse,
    recipientType: RECIPIENT_TYPE,
    recipientId: hospitalId,
    recipientName: hospitalName,
    status,
    simulationDisclaimer: SIMULATION_DISCLAIMER
  };

  // 1. Channel: SMS (Emergency Department Intake Alert)
  const smsNotification = {
    ...baseNotification,
    notificationId: idGenerator(),
    channel: NOTIFICATION_CHANNELS.SMS,
    destination: hospitalPhone,
    content: {
      format: 'PLAIN_TEXT',
      message: `[AI RESCUEFLOW TRAUMA ADVISORY - SIMULATION]\nATTN: ${hospitalName} Intake Dispatch\nIncident ID: ${incidentId}\nSeverity: ${severity} (${traumaLevel})\nGPS: ${gps}\nVehicle: ${vehicle}\nEstimated Injuries: ${estimatedInjuries}\nETA: ~${etaMinutes} mins\nTimestamp: ${notifTimestamp}\nRecommended Response: ${recommendedResponse}\n${SIMULATION_DISCLAIMER}`
    }
  };

  // 2. Channel: PHONE (Hospital CAD / Direct Trauma Hotline Patch)
  const phoneNotification = {
    ...baseNotification,
    notificationId: idGenerator(),
    channel: NOTIFICATION_CHANNELS.PHONE,
    destination: hospitalPhone,
    content: {
      format: 'VOICE_TRANSCRIPT',
      callDurationSeconds: 52,
      voiceEngine: 'AI_SYNTHESIZED_HOSPITAL_CAD_PATCH',
      transcript: `Inbound telematics collision alert for ${hospitalName} Emergency Department. Incident ID: ${incidentId}. Severity: ${severity}. Crash GPS coordinates: ${gps}. Vehicles involved: ${vehicle}. Estimated occupant injuries: ${estimatedInjuries}. Timestamp: ${notifTimestamp}. Recommended clinical triage: ${recommendedResponse}. Inbound ambulance transit window estimated at ${etaMinutes} minutes. Prepare trauma resuscitation suite. Notice: ${SIMULATION_DISCLAIMER}.`
    }
  };

  // 3. Channel: EMAIL (Electronic Pre-Hospital Trauma Record)
  const emailNotification = {
    ...baseNotification,
    notificationId: idGenerator(),
    channel: NOTIFICATION_CHANNELS.EMAIL,
    destination: hospitalEmail,
    content: {
      format: 'HTML_AND_TEXT',
      subject: `[SIMULATION] INBOUND TRAUMA NOTIFICATION — Incident ${incidentId} [${severity}]`,
      from: 'cad-dispatch@rescueflow-trauma.simulated.net',
      to: hospitalEmail,
      body: `AI RESCUEFLOW SHADOW — INBOUND CASUALTY NOTIFICATION\n\n` +
        `Facility: ${hospitalName} (${traumaLevel})\n` +
        `Incident ID: ${incidentId}\n` +
        `Severity: ${severity}\n` +
        `GPS Coordinates: ${gps}\n` +
        `Vehicles: ${vehicle}\n` +
        `Estimated Injuries: ${estimatedInjuries}\n` +
        `Inbound ETA: ~${etaMinutes} minutes\n` +
        `Timestamp: ${notifTimestamp}\n` +
        `Recommended Response: ${recommendedResponse}\n` +
        `Telemetry Data: ${JSON.stringify(telemetry || { roadCondition: 'confirmed' })}\n\n` +
        `*** ${SIMULATION_DISCLAIMER} ***`
    }
  };

  // 4. Channel: PUSH (Trauma Pager / Mobile EMR Notification)
  const pushNotification = {
    ...baseNotification,
    notificationId: idGenerator(),
    channel: NOTIFICATION_CHANNELS.PUSH,
    destination: `DEVICE_TOKEN_HOSP_${hospitalId}`,
    content: {
      format: 'PUSH_PAYLOAD',
      title: `TRAUMA CODE RED - ${severity}`,
      subtitle: `Inbound casualty: Incident ${incidentId}`,
      body: `Incoming casualty from ${gps}. Vehicle: ${vehicle}. Est. Injuries: ${estimatedInjuries}. ETA ~${etaMinutes}m. Rec: ${recommendedResponse}. ${SIMULATION_DISCLAIMER}`,
      badge: 1,
      sound: 'trauma_alert_priority_1.wav',
      data: {
        incidentId,
        severity,
        gps,
        vehicle,
        estimatedInjuries,
        timestamp: notifTimestamp,
        recommendedResponse,
        traumaLevel,
        etaMinutes,
        simulationDisclaimer: SIMULATION_DISCLAIMER
      }
    }
  };

  return [smsNotification, phoneNotification, emailNotification, pushNotification];
}

export default {
  SIMULATION_DISCLAIMER,
  NOTIFICATION_CHANNELS,
  RECIPIENT_TYPE,
  formatHospitalNotifications
};
