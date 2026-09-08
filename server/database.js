import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '../data.sqlite');
sqlite3.verbose();

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Failed to connect to SQLite database:', err);
  } else {
    console.log('✅ Connected to SQLite database at:', dbPath);
    initTables();
  }
});

// Helper for promise-based queries
export function dbRun(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

export function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function initTables() {
  db.serialize(() => {
    // 1. Incidents Table
    db.run(`
      CREATE TABLE IF NOT EXISTS incidents (
        id TEXT PRIMARY KEY,
        timestamp TEXT,
        status TEXT,
        severity_level TEXT,
        severity_score INTEGER,
        impact_speed_kmh INTEGER,
        g_force_b REAL,
        vehicle_a_json TEXT,
        vehicle_b_json TEXT,
        telemetry_json TEXT,
        dispatches_json TEXT,
        timeline_json TEXT,
        prevention_json TEXT,
        report_json TEXT
      )
    `);

    // 2. Risk Alerts Table
    db.run(`
      CREATE TABLE IF NOT EXISTS alerts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT,
        risk_score INTEGER,
        risk_category TEXT,
        driver_a_action TEXT,
        driver_b_action TEXT,
        ttc REAL
      )
    `);

    // 3. Analytics Logs Table
    db.run(`
      CREATE TABLE IF NOT EXISTS analytics_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        total_scenarios INTEGER,
        high_risk_alerts INTEGER,
        incidents_recorded INTEGER,
        avg_response_min REAL,
        prevented_collisions INTEGER
      )
    `);

    // Seed initial demo data if empty
    db.get('SELECT COUNT(*) as count FROM incidents', (err, row) => {
      if (!err && row && row.count === 0) {
        seedInitialData();
      }
    });
  });
}

async function seedInitialData() {
  console.log('🌱 Seeding initial demo data into SQLite database...');

  // Seed sample incident
  const sampleIncident = {
    id: 'INC-849201',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'RESOLVED',
    severity_level: 'CRITICAL',
    severity_score: 88,
    impact_speed_kmh: 46,
    g_force_b: 14.2,
    vehicle_a_json: JSON.stringify({ type: 'College Bus', speed: 42, distance: 38 }),
    vehicle_b_json: JSON.stringify({ type: 'Ola Car', speed: 8, distance: 22 }),
    telemetry_json: JSON.stringify({ ttc: 1.8, roadCondition: 'dry', visibility: 'good' }),
    dispatches_json: JSON.stringify([
      { unitId: 'EMS-102', agency: 'Metro Trauma Center', status: 'COMPLETED', etaMinutes: 4 },
      { unitId: 'FIRE-04', agency: 'City Fire Tender', status: 'COMPLETED', etaMinutes: 5 },
      { unitId: 'POLICE-P8', agency: 'Traffic Patrol P8', status: 'COMPLETED', etaMinutes: 3 }
    ]),
    timeline_json: JSON.stringify([
      { step: 1, label: 'Impact Detected', time: '10:14:02', status: 'COMPLETED' },
      { step: 2, label: 'Emergency Dispatches Triggered', time: '10:14:07', status: 'COMPLETED' },
      { step: 3, label: 'Responders On Scene', time: '10:17:30', status: 'COMPLETED' },
      { step: 4, label: 'Scene Cleared', time: '10:45:00', status: 'COMPLETED' }
    ]),
    prevention_json: JSON.stringify([
      { title: 'Smart Signal Timing', recommendation: 'Extend yellow signal duration by +2.5s' },
      { title: 'Geofenced Bus Limiter', recommendation: 'Enforce 30 km/h max speed near intersections' }
    ]),
    report_json: JSON.stringify({ summary: 'College Bus collided with Ola sedan at 90-degree intersection. Automatic RescueFlow dispatched 3 units.' })
  };

  await dbRun(
    `INSERT INTO incidents (
      id, timestamp, status, severity_level, severity_score, impact_speed_kmh, g_force_b,
      vehicle_a_json, vehicle_b_json, telemetry_json, dispatches_json, timeline_json, prevention_json, report_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      sampleIncident.id,
      sampleIncident.timestamp,
      sampleIncident.status,
      sampleIncident.severity_level,
      sampleIncident.severity_score,
      sampleIncident.impact_speed_kmh,
      sampleIncident.g_force_b,
      sampleIncident.vehicle_a_json,
      sampleIncident.vehicle_b_json,
      sampleIncident.telemetry_json,
      sampleIncident.dispatches_json,
      sampleIncident.timeline_json,
      sampleIncident.prevention_json,
      sampleIncident.report_json
    ]
  );

  // Seed sample alerts
  const sampleAlerts = [
    { risk: 86, cat: 'CRITICAL', ttc: 1.8, actA: 'College Bus Driver: BRAKE IMMEDIATELY!', actB: 'Ola Car Driver: STOP NOW!' },
    { risk: 68, cat: 'HIGH', ttc: 2.9, actA: 'College Bus Driver: Cover brake pedal now.', actB: 'Ola Car Driver: Yield right of way.' },
    { risk: 47, cat: 'CAUTION', ttc: 4.2, actA: 'College Bus Driver: Reduce speed.', actB: 'Ola Car Driver: Observe traffic.' }
  ];

  for (const a of sampleAlerts) {
    await dbRun(
      `INSERT INTO alerts (timestamp, risk_score, risk_category, driver_a_action, driver_b_action, ttc)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [new Date().toISOString(), a.risk, a.cat, a.actA, a.actB, a.ttc]
    );
  }

  // Seed analytics logs
  await dbRun(
    `INSERT INTO analytics_logs (date, total_scenarios, high_risk_alerts, incidents_recorded, avg_response_min, prevented_collisions)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [new Date().toISOString().split('T')[0], 48, 14, 3, 4.2, 11]
  );

  console.log('✅ Seed data successfully inserted.');
}
