/**
 * AI RESCUEFLOW SHADOW — Phase B Verification Test Suite
 * Validates Notification Engine and Multi-Channel Adapters:
 * 1. Stable notification IDs (NOTIF-000001)
 * 2. Standardized notification status enum (SIMULATED_SENT, SKIPPED_DUPLICATE, etc.)
 * 3. Multi-channel adapters (familyAdapter, hospitalAdapter, policeAdapter)
 * 4. All 4 channels generated per recipient (SMS, PHONE, EMAIL, PUSH)
 * 5. Mandatory 7 fields + SIMULATION DISCLAIMER in every single notification
 * 6. Deduplication preventing duplicate notifications + retry count tracking
 * 7. Combined orchestration + notification payload
 * 8. Channel summaries (SMS, PHONE, EMAIL, PUSH, TOTAL)
 * 9. Timeline events with stage, timestamp, durationMs, status
 * 10. Separate in-memory storage (notificationHistory, incidentHistory, dispatchHistory)
 * 11. REST API endpoints verification
 */

import http from 'http';
import express from 'express';
import { 
  notificationEngine, 
  NOTIFICATION_STATUS, 
  INCIDENT_STATUS,
  NOTIFICATION_CHANNELS, 
  RECIPIENT_TYPES,
  SIMULATION_DISCLAIMER 
} from './services/notificationEngine.js';
import { formatFamilyNotifications } from './services/notification/familyAdapter.js';
import { formatHospitalNotifications } from './services/notification/hospitalAdapter.js';
import { formatPoliceNotifications } from './services/notification/policeAdapter.js';
import { analyzeIncident } from './services/rescueEngine.js';
import { db } from './database.js';
import apiRouter from './routes/api.js';

let totalPassed = 0;
let totalFailed = 0;

function assert(condition, message) {
  if (condition) {
    totalPassed++;
    console.log(`  ✓ PASS: ${message}`);
  } else {
    totalFailed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('===============================================================');
console.log('AI RESCUEFLOW SHADOW — PHASE B TEST SUITE');
console.log('SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED');
console.log('===============================================================\n');

async function runTests() {
  // -----------------------------------------------------------------------------
  // TEST SUITE 1: STABLE NOTIFICATION IDS & ENUMS
  // -----------------------------------------------------------------------------
  console.log('--- TEST SUITE 1: Stable Notification IDs & Status Enums ---');

  notificationEngine.reset();

  const id1 = notificationEngine.nextNotificationId();
  const id2 = notificationEngine.nextNotificationId();

  assert(id1 === 'NOTIF-000001', 'First notification ID is formatted as NOTIF-000001');
  assert(id2 === 'NOTIF-000002', 'Subsequent notification ID increments to NOTIF-000002');
  assert(/^NOTIF-\d{6}$/.test(id1), 'Notification ID matches regex ^NOTIF-\\d{6}$');

  const expectedStatuses = ['QUEUED', 'GENERATED', 'SIMULATED_SENT', 'SKIPPED_DUPLICATE', 'FAILED', 'RETRYING'];
  const allStatusesDefined = expectedStatuses.every(s => NOTIFICATION_STATUS[s] === s);
  assert(allStatusesDefined, `NOTIFICATION_STATUS enum contains: [${expectedStatuses.join(', ')}]`);

  const expectedIncidentStatuses = ['CREATED', 'ORCHESTRATED', 'NOTIFICATIONS_GENERATED', 'DISPATCH_PLANNED', 'COMPLETED', 'FAILED'];
  const allIncStatusesDefined = expectedIncidentStatuses.every(s => INCIDENT_STATUS[s] === s);
  assert(allIncStatusesDefined, `INCIDENT_STATUS enum contains: [${expectedIncidentStatuses.join(', ')}]`);

  const expectedChannels = ['SMS', 'PHONE', 'EMAIL', 'PUSH'];
  const allChannelsDefined = expectedChannels.every(c => NOTIFICATION_CHANNELS[c] === c);
  assert(allChannelsDefined, `NOTIFICATION_CHANNELS enum contains: [${expectedChannels.join(', ')}]`);

  // -----------------------------------------------------------------------------
  // TEST SUITE 2: ADAPTERS & MANDATORY 7 NOTIFICATION FIELDS
  // -----------------------------------------------------------------------------
  console.log('\n--- TEST SUITE 2: Multi-Channel Adapters (Family, Hospital, Police) ---');

  const mockBaseContext = {
    incidentId: 'INC-B-TEST-001',
    severity: 'CRITICAL',
    gps: '37.774900, -122.419400',
    vehicle: 'BUS #7 (College Bus) & CAR #12 (Ola Sedan)',
    estimatedInjuries: '3-4 severe polytrauma injuries; extrication required',
    timestamp: '2026-09-07T15:00:00Z',
    recommendedResponse: 'Immediate Level 1 Trauma ALS response and corridor lockdown'
  };

  const idCounter = { val: 100 };
  const mockIdGen = () => `NOTIF-${String(++idCounter.val).padStart(6, '0')}`;

  const requiredFields = [
    'incidentId',
    'severity',
    'gps',
    'vehicle',
    'estimatedInjuries',
    'timestamp',
    'recommendedResponse',
    'simulationDisclaimer',
    'notificationId',
    'channel',
    'recipientType',
    'recipientId',
    'status'
  ];

  function validateNotificationFields(notifs, adapterName) {
    assert(Array.isArray(notifs) && notifs.length === 4, `${adapterName} produces exactly 4 channel notifications`);
    
    const channelsPresent = notifs.map(n => n.channel);
    assert(
      expectedChannels.every(c => channelsPresent.includes(c)),
      `${adapterName} covers all 4 channels: SMS, PHONE, EMAIL, PUSH`
    );

    let allHaveRequired = true;
    let allHaveDisclaimer = true;
    for (const notif of notifs) {
      for (const field of requiredFields) {
        if (!notif[field]) {
          allHaveRequired = false;
          console.error(`Missing field ${field} in ${adapterName} channel ${notif.channel}`);
        }
      }
      if (notif.simulationDisclaimer !== SIMULATION_DISCLAIMER) {
        allHaveDisclaimer = false;
      }
      if (typeof notif.content?.message === 'string' && !notif.content.message.includes(SIMULATION_DISCLAIMER)) {
        allHaveDisclaimer = false;
      }
    }

    assert(allHaveRequired, `${adapterName} notifications contain all 7 core fields + ID + status`);
    assert(allHaveDisclaimer, `${adapterName} notifications explicitly display: "${SIMULATION_DISCLAIMER}"`);
  }

  // Test Family Adapter
  const famNotifs = formatFamilyNotifications({
    ...mockBaseContext,
    recipient: { id: 'FAM-001', name: 'Sarah Jenkins', relationship: 'Spouse', phone: '+1-555-019-3321', email: 'sarah@demo.test' },
    hospital: { name: 'Metro Trauma Center' },
    idGenerator: mockIdGen
  });
  validateNotificationFields(famNotifs, 'familyAdapter');

  // Test Hospital Adapter
  const hospNotifs = formatHospitalNotifications({
    ...mockBaseContext,
    recipient: { id: 'HOSP-001', name: 'Metro General Hospital', phone: '+1-555-019-4821', email: 'er@metro.demo', priority: 'LEVEL_1_TRAUMA' },
    telemetry: { speedKmh: 45 },
    idGenerator: mockIdGen
  });
  validateNotificationFields(hospNotifs, 'hospitalAdapter');

  // Test Police Adapter
  const polNotifs = formatPoliceNotifications({
    ...mockBaseContext,
    recipient: { id: 'POL-001', name: 'SFPD Central Traffic Division', phone: '+1-555-019-9112', email: 'dispatch@sfpd.demo' },
    location: { 'road name': 'Market Street Urban Transit Corridor' },
    idGenerator: mockIdGen
  });
  validateNotificationFields(polNotifs, 'policeAdapter');

  // -----------------------------------------------------------------------------
  // TEST SUITE 3: NOTIFICATION ENGINE & COMBINED ORCHESTRATION PAYLOAD
  // -----------------------------------------------------------------------------
  console.log('\n--- TEST SUITE 3: Notification Engine & Combined Orchestration ---');

  notificationEngine.reset();

  const mockTelemetry = {
    incidentId: 'INC-CRASH-4891',
    isCollisionConfirmed: true,
    severity: 'CRITICAL',
    latitude: 37.7749,
    longitude: -122.4194,
    vehicleA: { type: 'College Bus', speed: 45, mass: 12000 },
    vehicleB: { type: 'Ola Sedan', speed: 10, mass: 1400 },
    environment: { roadCondition: 'wet', visibility: 'good' }
  };

  const notifyResult = notificationEngine.notify(mockTelemetry);

  assert(notifyResult.incidentId === 'INC-CRASH-4891', 'Notification response matches incidentId');
  assert(notifyResult.severity === 'CRITICAL', 'Notification response reflects CRITICAL severity');
  assert(Array.isArray(notifyResult.dispatchPlan) && notifyResult.dispatchPlan.length > 0, 'Response includes orchestrator dispatchPlan');
  assert(Array.isArray(notifyResult.notifications) && notifyResult.notifications.length > 0, 'Response includes generated notifications');
  assert(Array.isArray(notifyResult.timeline) && notifyResult.timeline.length > 0, 'Response includes timeline');
  assert(notifyResult.simulationDisclaimer === SIMULATION_DISCLAIMER, 'Response displays mandatory simulation disclaimer');

  // Verify Channel Summary
  assert('channelSummary' in notifyResult, 'Response includes channelSummary');
  const cs = notifyResult.channelSummary;
  assert(cs.SMS > 0 && cs.PHONE > 0 && cs.EMAIL > 0 && cs.PUSH > 0, 'All 4 channels have counts in channelSummary');
  assert(cs.SMS + cs.PHONE + cs.EMAIL + cs.PUSH === cs.TOTAL, 'channelSummary TOTAL equals sum of all channels (SMS+PHONE+EMAIL+PUSH)');
  assert(notifyResult.notifications.length === cs.TOTAL, 'Total notifications matches channelSummary.TOTAL');

  // Verify Recipient Summary
  assert('recipientSummary' in notifyResult, 'Response includes recipientSummary');
  const rs = notifyResult.recipientSummary;
  assert(rs.FAMILY > 0 && rs.HOSPITAL > 0 && rs.POLICE > 0, 'All recipient types present in recipientSummary');
  assert(rs.FAMILY + rs.HOSPITAL + rs.POLICE === rs.TOTAL, 'recipientSummary TOTAL equals sum of FAMILY + HOSPITAL + POLICE');

  // Verify Incident Status
  assert(notifyResult.incidentStatus === INCIDENT_STATUS.COMPLETED, 'Response includes incidentStatus: COMPLETED');

  // Verify Timeline Structure with timestamps & durationMs
  let timelineValid = true;
  for (const item of notifyResult.timeline) {
    if (!item.stage || !item.timestamp || typeof item.durationMs !== 'number' || !item.status) {
      timelineValid = false;
      console.error('Invalid timeline item structure:', item);
    }
  }
  assert(timelineValid, 'Timeline events contain stage, timestamp, durationMs, and status');

  // -----------------------------------------------------------------------------
  // TEST SUITE 4: DEDUPLICATION & RETRY COUNT TRACKING
  // -----------------------------------------------------------------------------
  console.log('\n--- TEST SUITE 4: Deduplication & Retry Count Tracking ---');

  const firstNotifCount = notifyResult.notifications.length;

  // Attempt duplicate dispatch on same incident
  const duplicateResult = notificationEngine.notify(mockTelemetry);

  assert(duplicateResult.notifications.length === 0, 'No duplicate notifications generated on repeat dispatch attempt');
  assert(duplicateResult.dispatchStatus === 'ALL_RECIPIENTS_SKIPPED_DUPLICATE', 'Dispatch status reports duplicate suppression');
  assert(duplicateResult.currentStatus === NOTIFICATION_STATUS.SKIPPED_DUPLICATE, 'Current status is SKIPPED_DUPLICATE');
  assert(duplicateResult.retryCount > 0, 'Retry count is incremented on duplicate dispatch attempt');

  // Check recipient records
  const skippedRecipients = duplicateResult.recipients.every(r => r.status === NOTIFICATION_STATUS.SKIPPED_DUPLICATE && r.retryCount >= 2);
  assert(skippedRecipients, 'Recipient records store SKIPPED_DUPLICATE and incremented retryCount');

  // -----------------------------------------------------------------------------
  // TEST SUITE 5: SEPARATE IN-MEMORY HISTORY STORES
  // -----------------------------------------------------------------------------
  console.log('\n--- TEST SUITE 5: Separate In-Memory History Stores ---');

  const history = notificationEngine.getHistory();

  assert(Array.isArray(history.notificationHistory), 'Separate notificationHistory store exists as an array');
  assert(Array.isArray(history.incidentHistory), 'Separate incidentHistory store exists');
  assert(Array.isArray(history.dispatchHistory), 'Separate dispatchHistory store exists');
  assert(history.notificationHistory.length === firstNotifCount, `notificationHistory contains exactly ${firstNotifCount} notifications`);
  assert(history.incidentHistory.length === 1, 'incidentHistory contains 1 recorded incident');
  assert(history.dispatchHistory.length >= 3, 'dispatchHistory contains recipient dispatch attempt records');

  // Check getStatus(:incidentId)
  const statusPayload = notificationEngine.getStatus('INC-CRASH-4891');
  assert(statusPayload.found === true, 'getStatus finds existing incident');
  assert(statusPayload.incidentId === 'INC-CRASH-4891', 'getStatus returns correct incidentId');
  assert(statusPayload.incidentStatus === INCIDENT_STATUS.COMPLETED, 'getStatus returns incidentStatus: COMPLETED');
  assert('recipientSummary' in statusPayload && statusPayload.recipientSummary.TOTAL > 0, 'getStatus returns recipientSummary');
  assert(statusPayload.notifications.length === firstNotifCount, 'getStatus returns notification records for the incident');
  assert(statusPayload.simulationDisclaimer === SIMULATION_DISCLAIMER, 'getStatus includes simulation disclaimer');

  const notFoundStatus = notificationEngine.getStatus('INC-NON-EXISTENT');
  assert(notFoundStatus.found === false && notFoundStatus.currentStatus === NOTIFICATION_STATUS.FAILED, 'getStatus gracefully handles non-existent incident');
  assert(notFoundStatus.incidentStatus === INCIDENT_STATUS.FAILED, 'getStatus returns incidentStatus: FAILED for non-existent incident');

  // -----------------------------------------------------------------------------
  // TEST SUITE 6: REST API ENDPOINTS VIA HTTP
  // -----------------------------------------------------------------------------
  console.log('\n--- TEST SUITE 6: REST API Endpoints Verification ---');

  const app = express();
  app.use(express.json());
  app.use('/api', apiRouter);

  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}/api`;

  async function apiGet(endpoint) {
    const res = await fetch(`${baseUrl}${endpoint}`);
    const data = await res.json();
    return { status: res.status, data };
  }

  async function apiPost(endpoint, body) {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    return { status: res.status, data };
  }

  // 1. GET /api/emergency/services
  const srvRes = await apiGet('/emergency/services');
  assert(srvRes.status === 200, 'GET /api/emergency/services returns 200 OK');
  assert(srvRes.data.totalServices > 0, 'Returns totalServices > 0');
  assert(Array.isArray(srvRes.data.hospitals) && srvRes.data.hospitals.length > 0, 'Returns list of hospitals');
  assert(Array.isArray(srvRes.data.policeStations) && srvRes.data.policeStations.length > 0, 'Returns list of police stations');
  assert(srvRes.data.simulationDisclaimer === SIMULATION_DISCLAIMER, 'Services endpoint includes simulation disclaimer');

  // 2. POST /api/emergency/orchestrate
  const orchPayload = {
    incidentId: 'INC-ORCH-API-TEST',
    isCollisionConfirmed: true,
    severity: 'HIGH',
    latitude: 37.7749,
    longitude: -122.4194
  };
  const orchRes = await apiPost('/emergency/orchestrate', orchPayload);
  assert(orchRes.status === 200, 'POST /api/emergency/orchestrate returns 200 OK');
  assert(orchRes.data.activated === true, 'Orchestrate returns activated: true');
  assert(orchRes.data.severity === 'HIGH', 'Orchestrate applies HIGH severity');
  assert(Array.isArray(orchRes.data.dispatchPlan), 'Orchestrate returns dispatchPlan array');
  assert(orchRes.data.simulationDisclaimer === SIMULATION_DISCLAIMER, 'Orchestrate includes simulation disclaimer');

  // 3. POST /api/emergency/notify
  const notifyPayload = {
    incidentId: 'INC-NOTIFY-API-TEST',
    isCollisionConfirmed: true,
    severity: 'CRITICAL',
    latitude: 37.7749,
    longitude: -122.4194,
    vehicleA: { type: 'College Bus' },
    vehicleB: { type: 'Ola Car' }
  };
  const notifRes = await apiPost('/emergency/notify', notifyPayload);
  assert(notifRes.status === 200, 'POST /api/emergency/notify returns 200 OK');
  assert(notifRes.data.incidentId === 'INC-NOTIFY-API-TEST', 'Notify returns matching incidentId');
  assert(notifRes.data.incidentStatus === INCIDENT_STATUS.COMPLETED, 'POST /api/emergency/notify returns incidentStatus: COMPLETED');
  assert(notifRes.data.recipientSummary?.TOTAL > 0, 'POST /api/emergency/notify returns recipientSummary');
  assert(Array.isArray(notifRes.data.notifications) && notifRes.data.notifications.length > 0, 'Notify returns notifications array');
  assert(notifRes.data.channelSummary?.TOTAL > 0, 'Notify returns channelSummary with TOTAL > 0');
  assert(Array.isArray(notifRes.data.timeline) && notifRes.data.timeline.length > 0, 'Notify returns timeline');
  assert(notifRes.data.simulationDisclaimer === SIMULATION_DISCLAIMER, 'Notify includes simulation disclaimer');

  // 4. GET /api/emergency/status/:incidentId
  const statusRes = await apiGet('/emergency/status/INC-NOTIFY-API-TEST');
  assert(statusRes.status === 200, 'GET /api/emergency/status/:incidentId returns 200 OK');
  assert(statusRes.data.found === true, 'Status endpoint finds the incident');
  assert(statusRes.data.incidentId === 'INC-NOTIFY-API-TEST', 'Status returns matching incident ID');
  assert(statusRes.data.incidentStatus === INCIDENT_STATUS.COMPLETED, 'GET /api/emergency/status returns incidentStatus: COMPLETED');
  assert(statusRes.data.recipientSummary?.TOTAL > 0, 'GET /api/emergency/status returns recipientSummary');
  assert(Array.isArray(statusRes.data.notifications), 'Status returns notifications list');
  assert(statusRes.data.simulationDisclaimer === SIMULATION_DISCLAIMER, 'Status includes simulation disclaimer');

  // 5. GET /api/emergency/history
  const histRes = await apiGet('/emergency/history');
  assert(histRes.status === 200, 'GET /api/emergency/history returns 200 OK');
  assert(histRes.data.totalNotifications > 0, 'History returns totalNotifications > 0');
  assert('recipientSummary' in histRes.data, 'History returns aggregate recipientSummary');
  assert(Array.isArray(histRes.data.notificationHistory), 'History returns notificationHistory array');
  assert(Array.isArray(histRes.data.incidentHistory), 'History returns incidentHistory array');
  assert(Array.isArray(histRes.data.dispatchHistory), 'History returns dispatchHistory array');
  assert(histRes.data.simulationDisclaimer === SIMULATION_DISCLAIMER, 'History includes simulation disclaimer');

  await new Promise(resolve => server.close(resolve));
  await new Promise(resolve => db.close(resolve));

  console.log('\n===============================================================');
  console.log(`PHASE B TEST RESULTS: ${totalPassed} PASSED, ${totalFailed} FAILED`);
  console.log('===============================================================');

  if (totalFailed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
