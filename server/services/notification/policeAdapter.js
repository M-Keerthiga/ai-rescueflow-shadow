/**
 * AI RESCUEFLOW SHADOW — Police Notification Adapter
 * Generates simulated multi-channel notifications for police departments, highway patrol, and public safety CAD.
 * Channels supported: SMS, PHONE, EMAIL, PUSH.
 * 
 * STRICT REQUIREMENT:
 * The entire implementation MUST operate in SIMULATION MODE.
 * Never contact any real emergency services or law enforcement agencies.
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

export const RECIPIENT_TYPE = 'POLICE';

/**
 * Formats simulated notifications across all 4 channels for a police facility.
 * 
 * @param {Object} params
 * @param {string} params.incidentId - Unique incident identifier
 * @param {string} params.severity - Severity level (LOW, MODERATE, HIGH, CRITICAL, CATASTROPHIC)
 * @param {string} params.gps - GPS coordinates string
 * @param {string} params.vehicle - Vehicle details string
 * @param {string} params.estimatedInjuries - Injury estimate summary
 * @param {string} params.timestamp - Incident / notification timestamp
 * @param {string} params.recommendedResponse - Recommended operational response
 * @param {Object} params.recipient - Police department record { id, name, phone, email, priority, etaMinutes }
 * @param {Object} [params.location] - Resolved location with road name and city
 * @param {Function} params.idGenerator - Function returning next stable notification ID (e.g. "NOTIF-000123")
 * @param {string} [params.status='SIMULATED_SENT'] - Standard notification status enum
 * @returns {Array<Object>} List of 4 channel notification records
 */
export function formatPoliceNotifications({
  incidentId,
  severity,
  gps,
  vehicle,
  estimatedInjuries,
  timestamp,
  recommendedResponse,
  recipient,
  location,
  idGenerator,
  status = 'SIMULATED_SENT'
}) {
  const notifTimestamp = timestamp || new Date().toISOString();
  const stationName = recipient?.name || 'Central Police Station & Traffic Division';
  const stationPhone = recipient?.phone || '+1-555-019-9112';
  const stationEmail = recipient?.email || 'dispatch@police.demo';
  const stationId = recipient?.id || 'POL-SF-01';
  const etaMinutes = recipient?.etaMinutes || 3;
  const roadName = location?.['road name'] || location?.roadName || 'Primary Urban Transit Corridor';

  const baseNotification = {
    incidentId,
    severity,
    gps,
    vehicle,
    estimatedInjuries,
    timestamp: notifTimestamp,
    recommendedResponse,
    recipientType: RECIPIENT_TYPE,
    recipientId: stationId,
    recipientName: stationName,
    roadName,
    status,
    simulationDisclaimer: SIMULATION_DISCLAIMER
  };

  // 1. Channel: SMS (Public Safety Highway Patrol SMS Dispatch)
  const smsNotification = {
    ...baseNotification,
    notificationId: idGenerator(),
    channel: NOTIFICATION_CHANNELS.SMS,
    destination: stationPhone,
    content: {
      format: 'PLAIN_TEXT',
      message: `[AI RESCUEFLOW POLICE DISPATCH - SIMULATION]\nATTN: ${stationName}\nIncident ID: ${incidentId}\nSeverity: ${severity}\nLocation: ${roadName} (${gps})\nVehicles: ${vehicle}\nEstimated Injuries: ${estimatedInjuries}\nTimestamp: ${notifTimestamp}\nRecommended Response: ${recommendedResponse}\nETA: ~${etaMinutes} mins\n${SIMULATION_DISCLAIMER}`
    }
  };

  // 2. Channel: PHONE (Public Safety CAD Radio Dispatch Bridge Call)
  const phoneNotification = {
    ...baseNotification,
    notificationId: idGenerator(),
    channel: NOTIFICATION_CHANNELS.PHONE,
    destination: stationPhone,
    content: {
      format: 'VOICE_TRANSCRIPT',
      callDurationSeconds: 48,
      voiceEngine: 'AI_SYNTHESIZED_POLICE_RADIO_BRIDGE',
      transcript: `CAD Priority Alert for ${stationName}. Major collision reported at ${roadName}, coordinates ${gps}. Incident ID: ${incidentId}. Severity: ${severity}. Vehicles involved: ${vehicle}. Estimated occupant injuries: ${estimatedInjuries}. Timestamp: ${notifTimestamp}. Recommended police tactical response: ${recommendedResponse}. Expedite traffic interceptors to secure ambulance transit corridor. Notice: ${SIMULATION_DISCLAIMER}.`
    }
  };

  // 3. Channel: EMAIL (Official Police Incident Telematics Memo)
  const emailNotification = {
    ...baseNotification,
    notificationId: idGenerator(),
    channel: NOTIFICATION_CHANNELS.EMAIL,
    destination: stationEmail,
    content: {
      format: 'HTML_AND_TEXT',
      subject: `[SIMULATION] POLICE CAD DISPATCH — Incident ${incidentId} [${severity}]`,
      from: 'cad-publicsafety@rescueflow-police.simulated.net',
      to: stationEmail,
      body: `AI RESCUEFLOW SHADOW — POLICE TRAFFIC & PERIMETER DISPATCH\n\n` +
        `Agency: ${stationName}\n` +
        `Incident ID: ${incidentId}\n` +
        `Severity: ${severity}\n` +
        `Road & Location: ${roadName}\n` +
        `GPS Coordinates: ${gps}\n` +
        `Vehicles Involved: ${vehicle}\n` +
        `Estimated Injuries: ${estimatedInjuries}\n` +
        `Timestamp: ${notifTimestamp}\n` +
        `Recommended Response: ${recommendedResponse}\n` +
        `Patrol Response ETA: ~${etaMinutes} minutes\n\n` +
        `*** ${SIMULATION_DISCLAIMER} ***`
    }
  };

  // 4. Channel: PUSH (Mobile Data Terminal [MDT] Cruiser Alert)
  const pushNotification = {
    ...baseNotification,
    notificationId: idGenerator(),
    channel: NOTIFICATION_CHANNELS.PUSH,
    destination: `DEVICE_MDT_CRUISER_${stationId}`,
    content: {
      format: 'PUSH_PAYLOAD',
      title: `CAD TRAFFIC DISPATCH [${severity}]`,
      subtitle: `${roadName} — Incident ${incidentId}`,
      body: `Crash telematics alert at ${roadName} (${gps}). Vehicles: ${vehicle}. Est. Injuries: ${estimatedInjuries}. Rec: ${recommendedResponse}. ${SIMULATION_DISCLAIMER}`,
      badge: 1,
      sound: 'police_cad_siren_simulated.wav',
      data: {
        incidentId,
        severity,
        gps,
        roadName,
        vehicle,
        estimatedInjuries,
        timestamp: notifTimestamp,
        recommendedResponse,
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
  formatPoliceNotifications
};
