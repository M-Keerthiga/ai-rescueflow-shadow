/**
 * AI RESCUEFLOW SHADOW — Phase A Verification Test Suite
 * Validates Emergency Response Backend Foundation components:
 * 1. Datasets schema integrity (hospitals, policeStations, demoFamilyContacts)
 * 2. Location Service (offline reverse-geocoding, zero external APIs)
 * 3. Nearest Service Finder (Haversine distance, ETA, availability, priority)
 * 4. Deduplication Service (incident-recipient deduplication & tracking)
 * 5. Dispatch Planner (Severity Policy compliance across LOW, MODERATE, HIGH, CRITICAL, CATASTROPHIC)
 * 6. Emergency Response Orchestrator (collision gating, output schema, simulation disclaimer)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { resolveLocation } from './services/locationService.js';
import { haversineDistanceKm, calculateETA, findNearestServices } from './services/nearestServiceFinder.js';
import { deduplicationService } from './services/deduplicationService.js';
import { getSeverityPolicy, createDispatchPlan, createTimeline } from './services/dispatchPlanner.js';
import { emergencyResponseOrchestrator, isCollisionConfirmed, orchestrateEmergencyResponse } from './services/emergencyResponseOrchestrator.js';
import { analyzeIncident } from './services/rescueEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
console.log('AI RESCUEFLOW SHADOW — PHASE A TEST SUITE');
console.log('SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED');
console.log('===============================================================\n');

// -----------------------------------------------------------------------------
// TEST SUITE 1: DATASETS SCHEMA INTEGRITY
// -----------------------------------------------------------------------------
console.log('--- TEST SUITE 1: Datasets Schema Validation ---');

const hospitalsPath = path.join(__dirname, 'data/hospitals.json');
const policeStationsPath = path.join(__dirname, 'data/policeStations.json');
const familyContactsPath = path.join(__dirname, 'data/demoFamilyContacts.json');

const hospitals = JSON.parse(fs.readFileSync(hospitalsPath, 'utf-8'));
assert(Array.isArray(hospitals) && hospitals.length >= 4, 'Hospitals dataset is loaded with >= 4 records');
const hSample = hospitals[0];
const hospFields = ['id', 'name', 'latitude', 'longitude', 'phone', 'email', 'city', 'state', 'availability', 'priority'];
const hospFieldsValid = hospFields.every(f => f in hSample);
assert(hFieldsValid(hSample, hospFields), `Hospital record contains all required fields: [${hospFields.join(', ')}]`);

function hFieldsValid(obj, fields) {
  return fields.every(f => obj && f in obj && obj[f] !== undefined);
}

const policeStations = JSON.parse(fs.readFileSync(policeStationsPath, 'utf-8'));
assert(Array.isArray(policeStations) && policeStations.length >= 4, 'Police stations dataset is loaded with >= 4 records');
const pSample = policeStations[0];
assert(hFieldsValid(pSample, hospFields), `Police station record matches schema with fields: [${hospFields.join(', ')}]`);

const familyContacts = JSON.parse(fs.readFileSync(familyContactsPath, 'utf-8'));
assert(Array.isArray(familyContacts) && familyContacts.length >= 3, 'Demo family contacts dataset is loaded with >= 3 records');
const fSample = familyContacts[0];
const famFields = ['id', 'name', 'relationship', 'phone', 'email', 'priority'];
assert(hFieldsValid(fSample, famFields), `Family contact record contains fields: [${famFields.join(', ')}]`);

// -----------------------------------------------------------------------------
// TEST SUITE 2: LOCATION SERVICE
// -----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 2: Location Service (Offline & Zero APIs) ---');

const locResult = resolveLocation({
  latitude: 37.7749,
  longitude: -122.4194,
  timestamp: '2026-09-07T14:30:00Z',
  vehicleHeading: 45
});

assert('GPS' in locResult && typeof locResult.GPS === 'string', 'Location service returns GPS field');
assert('nearest city' in locResult && locResult['nearest city'] === 'San Francisco', 'Location service resolves "nearest city" correctly');
assert('road name' in locResult && typeof locResult['road name'] === 'string', 'Location service resolves "road name"');
assert('confidence' in locResult && locResult.confidence > 0.7 && locResult.confidence <= 1.0, 'Location service returns high confidence score');
assert('coordinates' in locResult && locResult.coordinates.latitude === 37.7749 && locResult.coordinates.longitude === -122.4194, 'Location service returns coordinates object');

// Positional arguments test
const locResultPos = resolveLocation(37.8044, -122.2712, '2026-09-07T14:30:00Z', 180);
assert(locResultPos['nearest city'] === 'Oakland', 'Location service resolves Oakland for East Bay coordinates');

// -----------------------------------------------------------------------------
// TEST SUITE 3: NEAREST SERVICE FINDER (HAVERSINE & ETA)
// -----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 3: Nearest Service Finder ---');

// Haversine unit test: SF (37.7749, -122.4194) to Oakland (37.8044, -122.2712) is ~13.4 km
const testDist = haversineDistanceKm(37.7749, -122.4194, 37.8044, -122.2712);
assert(testDist > 12.0 && testDist < 15.0, `Haversine distance between SF and Oakland is realistic (${testDist} km)`);

const services = findNearestServices(37.7749, -122.4194);
assert('nearest hospital' in services && services['nearest hospital'] !== null, 'Finds nearest hospital');
assert('nearest police station' in services && services['nearest police station'] !== null, 'Finds nearest police station');
assert('distance' in services && typeof services.distance === 'number', 'Returns primary distance in km');
assert('ETA' in services && typeof services.ETA === 'number' && services.ETA >= 2, 'Returns ETA in minutes');
assert('availability' in services, 'Returns availability of nearest service');
assert('priority' in services, 'Returns priority of nearest service');

// -----------------------------------------------------------------------------
// TEST SUITE 4: DEDUPLICATION SERVICE
// -----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 4: Deduplication Service ---');

const testIncId = 'INC-DEDUP-TEST-001';
deduplicationService.clearRecords(testIncId);

const firstDispatch = deduplicationService.recordAttempt(testIncId, 'FAM-001', 'DISPATCHED');
assert(firstDispatch.allowed === true && firstDispatch.record.retryCount === 1, 'First dispatch to recipient is allowed (retryCount: 1)');
assert(firstDispatch.record.status === 'DISPATCHED', 'First dispatch status is DISPATCHED');
assert(firstDispatch.record.recipient === 'FAM-001', 'Record stores recipient identifier');
assert(firstDispatch.record.incident === testIncId, 'Record stores incident identifier');
assert('lastAttempt' in firstDispatch.record, 'Record stores lastAttempt timestamp');

// Duplicate attempt on same incident and recipient
const secondDispatch = deduplicationService.recordAttempt(testIncId, 'FAM-001', 'DISPATCHED');
assert(secondDispatch.allowed === false && secondDispatch.isDuplicate === true, 'Duplicate dispatch is strictly blocked (allowed: false)');
assert(secondDispatch.record.retryCount === 2, 'Retry count is incremented on duplicate dispatch (retryCount: 2)');
assert(secondDispatch.record.status === 'SKIPPED_DUPLICATE', 'Status is flagged as SKIPPED_DUPLICATE');

// Different incident with same recipient should be allowed
const diffIncDispatch = deduplicationService.recordAttempt('INC-DEDUP-TEST-002', 'FAM-001', 'DISPATCHED');
assert(diffIncDispatch.allowed === true, 'Same recipient can be notified for a distinct incident');

// -----------------------------------------------------------------------------
// TEST SUITE 5: SEVERITY POLICY & DISPATCH PLANNER
// -----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 5: Severity Policy & Dispatch Planner ---');

const lowPolicy = getSeverityPolicy('LOW');
assert(lowPolicy.recipients.includes('Family') && !lowPolicy.hospitalDispatched && !lowPolicy.policeDispatched, 'LOW severity policy notifies ONLY Family');

const modPolicy = getSeverityPolicy('MODERATE');
assert(modPolicy.recipients.includes('Family') && modPolicy.recipients.includes('Hospital') && !modPolicy.policeDispatched, 'MODERATE severity policy notifies Family and Hospital');

const highPolicy = getSeverityPolicy('HIGH');
assert(highPolicy.recipients.includes('Family') && highPolicy.recipients.includes('Hospital') && highPolicy.recipients.includes('Police'), 'HIGH severity policy notifies Family, Hospital, Police');

const critPolicy = getSeverityPolicy('CRITICAL');
assert(critPolicy.displayPriority === 'Highest Priority', 'CRITICAL policy designates "Highest Priority"');
assert(critPolicy.recipients.includes('Family') && critPolicy.recipients.includes('Hospital') && critPolicy.recipients.includes('Police'), 'CRITICAL policy notifies Family, Hospital, Police');

const catPolicy = getSeverityPolicy('CATASTROPHIC');
assert(catPolicy.displayPriority === 'Immediate Highest Priority', 'CATASTROPHIC policy designates "Immediate Highest Priority"');
assert(catPolicy.recipients.includes('Family') && catPolicy.recipients.includes('Hospital') && catPolicy.recipients.includes('Police'), 'CATASTROPHIC policy notifies Family, Hospital, Police');

// Dispatch plan creation check
const dPlan = createDispatchPlan({
  incidentId: 'INC-PLAN-TEST',
  severity: 'CRITICAL',
  location: locResult,
  selectedHospital: services['nearest hospital'],
  selectedPoliceStation: services['nearest police station'],
  familyRecipients: familyContacts
});
assert(dPlan.dispatches.length >= 5, 'CRITICAL dispatch plan includes Hospital, Police, and Family units');
assert(dPlan.simulationDisclaimer === 'SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED', 'Dispatch plan contains exact simulation disclaimer');

// Timeline creation check
const timeline = createTimeline('CRITICAL', locResult);
assert(Array.isArray(timeline) && timeline.length >= 6, 'Timeline contains full progression of response steps');

// -----------------------------------------------------------------------------
// TEST SUITE 6: EMERGENCY RESPONSE ORCHESTRATOR
// -----------------------------------------------------------------------------
console.log('\n--- TEST SUITE 6: Emergency Response Orchestrator & Collision Gate ---');

// 1. Unconfirmed collision gate test
const unconfirmedPayload = { isCollisionConfirmed: false, incidentId: 'INC-UNCONFIRMED' };
const blockedResult = orchestrateEmergencyResponse(unconfirmedPayload);
assert(blockedResult.activated === false, 'Orchestrator rejects unconfirmed collision (activated: false)');
assert(blockedResult.simulationDisclaimer === 'SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED', 'Blocked output includes simulation disclaimer');

// 2. Integration with RescueFlow Severity Engine (analyzeIncident)
const mockTelemetry = {
  vehicleA: { type: 'BUS #7', speed: 45, mass: 12000 },
  vehicleB: { type: 'CAR #12', speed: 12, mass: 1400 },
  environment: { roadCondition: 'wet', visibility: 'good' }
};

const incidentFromSeverityEngine = analyzeIncident(mockTelemetry);
assert(isCollisionConfirmed(incidentFromSeverityEngine) === true, 'RescueFlow Severity Engine output is recognized as confirmed collision');

// 3. Orchestrator execution with confirmed collision
const orchestratorOutput = orchestrateEmergencyResponse(incidentFromSeverityEngine);
assert(orchestratorOutput.activated === true, 'Orchestrator successfully activates on confirmed collision');

// Verify all required output fields
const requiredOutputKeys = [
  'incidentId',
  'severity',
  'responsePriority',
  'selectedHospital',
  'selectedPoliceStation',
  'familyRecipients',
  'dispatchPlan',
  'timeline',
  'simulationDisclaimer'
];

const allKeysPresent = requiredOutputKeys.every(k => k in orchestratorOutput && orchestratorOutput[k] !== undefined);
assert(allKeysPresent, `Orchestrator output includes all required fields: [${requiredOutputKeys.join(', ')}]`);
assert(orchestratorOutput.simulationDisclaimer === 'SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED', 'Orchestrator output includes mandatory disclaimer: SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED');
assert(orchestratorOutput.selectedHospital !== null && orchestratorOutput.selectedHospital.name, 'Orchestrator selected a valid hospital');
assert(orchestratorOutput.selectedPoliceStation !== null && orchestratorOutput.selectedPoliceStation.name, 'Orchestrator selected a valid police station');
assert(Array.isArray(orchestratorOutput.familyRecipients) && orchestratorOutput.familyRecipients.length > 0, 'Orchestrator processed family recipients');
assert(Array.isArray(orchestratorOutput.dispatchPlan) && orchestratorOutput.dispatchPlan.length > 0, 'Orchestrator generated dispatch plan items');
assert(Array.isArray(orchestratorOutput.timeline) && orchestratorOutput.timeline.length > 0, 'Orchestrator generated response timeline');

console.log('\n===============================================================');
console.log(`PHASE A TEST RESULTS: ${totalPassed} PASSED, ${totalFailed} FAILED`);
console.log('===============================================================');

if (totalFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
