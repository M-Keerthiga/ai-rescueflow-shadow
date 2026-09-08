/**
 * AI RESCUEFLOW SHADOW — Family Notification Adapter
 * Generates simulated multi-channel notifications for family emergency contacts.
 * Channels supported: SMS, PHONE, EMAIL, PUSH.
 * 
 * STRICT REQUIREMENT:
 * The entire implementation MUST operate in SIMULATION MODE.
 * Never contact any real emergency services or individuals.
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

export const RECIPIENT_TYPE = 'FAMILY';

/**
 * Formats simulated notifications across all 4 channels for a family recipient.
 * 
 * @param {Object} params
 * @param {string} params.incidentId - Unique incident identifier
 * @param {string} params.severity - Severity level (LOW, MODERATE, HIGH, CRITICAL, CATASTROPHIC)
 * @param {string} params.gps - GPS coordinates string (e.g. "37.774900, -122.419400")
 * @param {string} params.vehicle - Vehicle details string
 * @param {string} params.estimatedInjuries - Injury estimate summary
 * @param {string} params.timestamp - Incident / notification timestamp
 * @param {string} params.recommendedResponse - Recommended operational response
 * @param {Object} params.recipient - Family contact record { id, name, relationship, phone, email, priority }
 * @param {Object} [params.hospital] - Nearest hospital facility info
 * @param {Function} params.idGenerator - Function returning next stable notification ID (e.g. "NOTIF-000123")
 * @param {string} [params.status='SIMULATED_SENT'] - Standard notification status enum
 * @returns {Array<Object>} List of 4 channel notification records
 */
export function formatFamilyNotifications({
  incidentId,
  severity,
  gps,
  vehicle,
  estimatedInjuries,
  timestamp,
  recommendedResponse,
  recipient,
  hospital,
  idGenerator,
  status = 'SIMULATED_SENT'
}) {
  const notifTimestamp = timestamp || new Date().toISOString();
  const recipientName = recipient?.name || 'Emergency Contact';
  const relationship = recipient?.relationship || 'Family Member';
  const recipientPhone = recipient?.phone || '+1-555-019-3321';
  const recipientEmail = recipient?.email || 'contact@family.demo';
  const recipientId = recipient?.id || `FAM-${recipientName.replace(/\s+/g, '').toUpperCase()}`;
  const hospitalName = hospital?.name || 'Metro Regional Emergency Trauma Center';

  const baseNotification = {
    incidentId,
    severity,
    gps,
    vehicle,
    estimatedInjuries,
    timestamp: notifTimestamp,
    recommendedResponse,
    recipientType: RECIPIENT_TYPE,
    recipientId,
    recipientName,
    recipientRelationship: relationship,
    status,
    simulationDisclaimer: SIMULATION_DISCLAIMER
  };

  // 1. Channel: SMS
  const smsNotification = {
    ...baseNotification,
    notificationId: idGenerator(),
    channel: NOTIFICATION_CHANNELS.SMS,
    destination: recipientPhone,
    content: {
      format: 'PLAIN_TEXT',
      message: `[AI RESCUEFLOW EMERGENCY ADVISORY - SIMULATION]\nDear ${recipientName} (${relationship}), an automated collision alert was detected involving vehicle: ${vehicle}.\nIncident ID: ${incidentId}\nSeverity: ${severity}\nGPS: ${gps}\nEstimated Injuries: ${estimatedInjuries}\nTimestamp: ${notifTimestamp}\nRecommended Response: ${recommendedResponse}\nMedical Destination: ${hospitalName}\n${SIMULATION_DISCLAIMER}`
    }
  };

  // 2. Channel: PHONE (Simulated automated voice emergency call / speech transcript)
  const phoneNotification = {
    ...baseNotification,
    notificationId: idGenerator(),
    channel: NOTIFICATION_CHANNELS.PHONE,
    destination: recipientPhone,
    content: {
      format: 'VOICE_TRANSCRIPT',
      callDurationSeconds: 46,
      voiceEngine: 'AI_SYNTHESIZED_DISPATCH_SPEECH',
      transcript: `Attention ${recipientName}. This is an automated emergency advisory from AI RescueFlow. We have detected a vehicle collision involving ${vehicle}. Incident ID ${incidentId}. Severity classified as ${severity}. Incident GPS location is ${gps}. Estimated injuries: ${estimatedInjuries}. Timestamp: ${notifTimestamp}. Recommended response action: ${recommendedResponse}. Inbound patient transit coordinated with ${hospitalName}. Please note: ${SIMULATION_DISCLAIMER}.`
    }
  };

  // 3. Channel: EMAIL (Simulated formal incident emergency notification)
  const emailNotification = {
    ...baseNotification,
    notificationId: idGenerator(),
    channel: NOTIFICATION_CHANNELS.EMAIL,
    destination: recipientEmail,
    content: {
      format: 'HTML_AND_TEXT',
      subject: `[SIMULATION] Urgent Telematics Collision Alert — Incident ${incidentId} [${severity}]`,
      from: 'ai-rescueflow-notifications@system.simulated.net',
      to: recipientEmail,
      body: `AI RESCUEFLOW SHADOW — AUTOMATED FAMILY EMERGENCY DISPATCH\n\n` +
        `Recipient: ${recipientName} (${relationship})\n` +
        `Incident ID: ${incidentId}\n` +
        `Severity: ${severity}\n` +
        `GPS Coordinates: ${gps}\n` +
        `Vehicle Involved: ${vehicle}\n` +
        `Estimated Injuries: ${estimatedInjuries}\n` +
        `Timestamp: ${notifTimestamp}\n` +
        `Recommended Response: ${recommendedResponse}\n` +
        `Assigned Medical Facility: ${hospitalName}\n\n` +
        `*** ${SIMULATION_DISCLAIMER} ***`
    }
  };

  // 4. Channel: PUSH (Simulated mobile push notification)
  const pushNotification = {
    ...baseNotification,
    notificationId: idGenerator(),
    channel: NOTIFICATION_CHANNELS.PUSH,
    destination: `DEVICE_TOKEN_FAM_${recipientId}`,
    content: {
      format: 'PUSH_PAYLOAD',
      title: `Emergency Advisory [${severity}]`,
      subtitle: `Incident ${incidentId}`,
      body: `Collision detected for ${vehicle} @ ${gps}. Est. Injuries: ${estimatedInjuries}. Action: ${recommendedResponse}. ${SIMULATION_DISCLAIMER}`,
      badge: 1,
      sound: 'emergency_tone_simulated.wav',
      data: {
        incidentId,
        severity,
        gps,
        vehicle,
        estimatedInjuries,
        timestamp: notifTimestamp,
        recommendedResponse,
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
  formatFamilyNotifications
};
