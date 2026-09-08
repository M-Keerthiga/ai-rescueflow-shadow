import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  ShieldCheck,
  AlertTriangle,
  Hospital,
  Shield,
  Users,
  Clock,
  Send,
  Layers,
  CheckCircle2
} from 'lucide-react';
import ServiceStatusBadge from '../emergency/ServiceStatusBadge.jsx';

export const SIMULATION_DISCLAIMER = 'SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED';

/**
 * IncidentReportView Component (Extended Blackbox Report)
 * Complete legal and operational audit report containing:
 * - Telemetry & Collision Physics
 * - Emergency Contacts
 * - Selected Hospital & Police Station
 * - Notification History & Channel Metrics
 * - 10-Step Dispatch Timeline
 * - Final Incident Status
 * - Simulation Disclaimer
 * 
 * Supports JSON and PDF Exports without recalculations.
 */
export default function IncidentReportView({ incident }) {
  if (!incident) return null;

  const [downloadNotice, setDownloadNotice] = useState(null);

  // Extract or fallback fields from incident
  const incidentId = incident.id || incident.incidentId || 'INC-SIM-849201';
  const timestamp = incident.timestamp ? new Date(incident.timestamp).toLocaleString() : new Date().toLocaleString();
  const severityLevel = incident.severity_level || incident.severity?.level || incident.severity || 'CRITICAL';
  const severityScore = incident.severity_score || incident.severityScore || 88;
  const status = incident.status || incident.incidentStatus || 'COMPLETED';

  // Vehicles
  const vehA = typeof incident.vehicleA === 'object' ? incident.vehicleA : { type: 'College Bus', speed: 42, distance: 38 };
  const vehB = typeof incident.vehicleB === 'object' ? incident.vehicleB : { type: 'Ola Car', speed: 8, distance: 22 };

  // Emergency Services & Contacts
  const hospital = incident.selectedHospital || {
    name: 'Metro General & Trauma Hospital',
    distanceKm: 2.3,
    etaMinutes: 4,
    priority: 'LEVEL_1_TRAUMA'
  };

  const policeStation = incident.selectedPoliceStation || {
    name: 'SFPD Central Traffic Division',
    distanceKm: 1.8,
    etaMinutes: 3,
    priority: 'RAPID_INTERCEPTOR'
  };

  const familyContacts = incident.familyRecipients || incident.familyContacts || [
    { name: 'Sarah Jenkins', relationship: 'Spouse', phone: '+1-555-019-3321', status: 'SIMULATED_SENT' },
    { name: 'David Jenkins Sr.', relationship: 'Parent', phone: '+1-555-019-3322', status: 'SIMULATED_SENT' },
    { name: 'Emily Jenkins', relationship: 'Sibling', phone: '+1-555-019-3323', status: 'SIMULATED_SENT' }
  ];

  // Dispatches & Timeline
  const dispatches = Array.isArray(incident.dispatches) ? incident.dispatches : (incident.dispatchPlan || [
    { agency: hospital.name, unitType: 'Level 1 Trauma ALS Ambulance', etaMinutes: 4, status: 'SIMULATED_DISPATCHED' },
    { agency: policeStation.name, unitType: 'Corridor Lockdown Patrol', etaMinutes: 3, status: 'SIMULATED_DISPATCHED' }
  ]);

  const timeline = Array.isArray(incident.timeline) ? incident.timeline : (incident.responseTimeline || [
    { stage: 'INCIDENT_DETECTED', label: 'Incident Detected', duration: 120, status: 'COMPLETED' },
    { stage: 'SEVERITY_CALCULATED', label: 'Severity Calculated', duration: 95, status: 'COMPLETED' },
    { stage: 'LOCATION_VERIFIED', label: 'Location Verified', duration: 80, status: 'COMPLETED' },
    { stage: 'HOSPITAL_SELECTED', label: 'Nearest Hospital Selected', duration: 65, status: 'COMPLETED' },
    { stage: 'POLICE_SELECTED', label: 'Nearest Police Station Selected', duration: 70, status: 'COMPLETED' },
    { stage: 'FAMILY_NOTIFIED', label: 'Family Contacts Notified', duration: 110, status: 'COMPLETED' },
    { stage: 'NOTIFICATIONS_GENERATED', label: 'Notifications Generated', duration: 220, status: 'COMPLETED' },
    { stage: 'HOSPITAL_RESPONSE_PLANNED', label: 'Hospital Response Planned', duration: 90, status: 'COMPLETED' },
    { stage: 'POLICE_RESPONSE_PLANNED', label: 'Police Response Planned', duration: 85, status: 'COMPLETED' },
    { stage: 'INCIDENT_CLOSED', label: 'Incident Closed', duration: 50, status: 'COMPLETED' }
  ]);

  // JSON Export Handler (Single Source of Truth)
  const handleExportJSON = () => {
    const exportPayload = {
      incidentId,
      timestamp,
      status,
      severity: {
        level: severityLevel,
        score: severityScore
      },
      telemetry: {
        vehicleA: vehA,
        vehicleB: vehB,
        impactSpeedKmH: incident.impactSpeedKmH || 46,
        gForceB: incident.gForceB || 14.2
      },
      emergencyResponse: {
        selectedHospital: hospital,
        selectedPoliceStation: policeStation,
        familyContacts,
        dispatches,
        timeline,
        notificationSummary: {
          SMS: 5,
          PHONE: 5,
          EMAIL: 5,
          PUSH: 5,
          TOTAL: 20
        }
      },
      reconstructionSummary: 'Deterministic AI Shadow calculated critical collision risk and triggered multi-channel emergency simulation.',
      simulationDisclaimer: SIMULATION_DISCLAIMER
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `blackbox_audit_${incidentId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setDownloadNotice('JSON Audit Package Exported Successfully.');
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  // PDF Export Handler (Prints/Downloads formatted blackbox document)
  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="bg-navy-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl font-mono text-xs print:bg-white print:text-black print:p-2 print:border-none print:shadow-none">
      {/* Permanent Simulation Disclaimer Banner */}
      <div className="bg-amber-500/15 border border-amber-500/40 p-3 rounded-xl flex items-center justify-between flex-wrap gap-2 text-amber-300 font-bold print:border-black print:text-black print:bg-gray-100">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="uppercase tracking-wider">
            {SIMULATION_DISCLAIMER}
          </span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 print:text-black">
          LEGAL AUDIT SIMULATION RECORD
        </span>
      </div>

      {/* Header & Export Controls */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-5 gap-4 print:border-black">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 print:border-black print:text-black">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-slate-100 text-base sm:text-lg tracking-wide print:text-black">
              BLACKBOX INCIDENT AUDIT REPORT — #{incidentId}
            </h2>
            <p className="text-xs text-slate-400 print:text-gray-600">
              Generated: {timestamp} | System: AI RESCUEFLOW SHADOW
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          {downloadNotice && (
            <span className="text-emerald-400 font-bold text-xs flex items-center gap-1 animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {downloadNotice}
            </span>
          )}

          <button
            onClick={handleExportJSON}
            aria-label="Download JSON Incident Blackbox Report"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handleExportPDF}
            aria-label="Generate Downloadable PDF Incident Report"
            className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-cyan-950/40 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2 print:border-gray-300 print:bg-white">
          <div className="text-slate-500 font-bold border-b border-slate-800 pb-1 text-[10px] uppercase tracking-wider print:text-black">
            INCIDENT IDENTIFIER
          </div>
          <div>ID: <span className="text-cyan-400 font-bold select-all print:text-black">{incidentId}</span></div>
          <div className="flex items-center gap-2">
            <span>Status:</span>
            <ServiceStatusBadge status={status} size="sm" />
          </div>
          <div>Severity Score: <span className="text-red-400 font-bold print:text-black">{severityScore}/100 ({severityLevel})</span></div>
        </div>

        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2 print:border-gray-300 print:bg-white">
          <div className="text-slate-500 font-bold border-b border-slate-800 pb-1 text-[10px] uppercase tracking-wider print:text-black">
            VEHICLE A TELEMETRY
          </div>
          <div>Type: <span className="text-amber-400 font-bold print:text-black">{vehA.type || 'College Bus'}</span></div>
          <div>Pre-Impact Speed: <span className="text-slate-200 print:text-black">{vehA.speed || 42} km/h</span></div>
          <div>Impact Force: <span className="text-slate-200 print:text-black">{incident.impactSpeedKmH || 46} km/h relative</span></div>
        </div>

        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2 print:border-gray-300 print:bg-white">
          <div className="text-slate-500 font-bold border-b border-slate-800 pb-1 text-[10px] uppercase tracking-wider print:text-black">
            VEHICLE B TELEMETRY
          </div>
          <div>Type: <span className="text-cyan-400 font-bold print:text-black">{vehB.type || 'Ola Car'}</span></div>
          <div>Pre-Impact Speed: <span className="text-slate-200 print:text-black">{vehB.speed || 8} km/h</span></div>
          <div>Deceleration Peak: <span className="text-slate-200 print:text-black">{incident.gForceB || 14.2} G</span></div>
        </div>
      </div>

      {/* Emergency Agency Dispatches & Contacts Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Emergency Medical & Police Facilities */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3 print:border-gray-300 print:bg-white">
          <div className="text-cyan-400 font-bold border-b border-slate-800 pb-1.5 flex items-center gap-1.5 print:text-black">
            <Hospital className="w-4 h-4 text-emerald-400 print:text-black" />
            <span>ASSIGNED EMERGENCY FACILITIES</span>
          </div>
          <div className="space-y-2 text-[11px]">
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 space-y-1 print:bg-gray-50">
              <div className="flex justify-between font-bold">
                <span className="text-slate-100 print:text-black">{hospital.name}</span>
                <span className="text-emerald-400 print:text-black">~{hospital.etaMinutes || 4} min ETA</span>
              </div>
              <div className="text-slate-400 print:text-gray-600">Unit: Level 1 Trauma Life Support ALS Ambulance</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 space-y-1 print:bg-gray-50">
              <div className="flex justify-between font-bold">
                <span className="text-slate-100 print:text-black">{policeStation.name}</span>
                <span className="text-indigo-300 print:text-black">~{policeStation.etaMinutes || 3} min ETA</span>
              </div>
              <div className="text-slate-400 print:text-gray-600">Unit: Traffic Corridor Lockdown Patrol Interceptor</div>
            </div>
          </div>
        </div>

        {/* Family Emergency Contacts */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3 print:border-gray-300 print:bg-white">
          <div className="text-cyan-400 font-bold border-b border-slate-800 pb-1.5 flex items-center gap-1.5 print:text-black">
            <Users className="w-4 h-4 text-cyan-400 print:text-black" />
            <span>EMERGENCY FAMILY CONTACTS DISPATCHED</span>
          </div>
          <div className="space-y-2 text-[11px]">
            {familyContacts.map((c, i) => (
              <div key={i} className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center justify-between print:bg-gray-50">
                <div>
                  <span className="font-bold text-slate-100 print:text-black">{c.name}</span>
                  <span className="text-slate-400 ml-2 print:text-gray-600">({c.relationship})</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-bold text-[10px] border border-emerald-500/30 print:text-black">
                  NOTIFIED
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 10-Step Dispatch Progression Table */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3 print:border-gray-300 print:bg-white">
        <div className="text-cyan-400 font-bold border-b border-slate-800 pb-1.5 flex items-center gap-1.5 print:text-black">
          <Clock className="w-4 h-4 text-amber-400 print:text-black" />
          <span>DISPATCH RESPONSE TIMELINE PROGRESSION</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          {timeline.map((step, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800/60 print:bg-gray-50">
              <span className="text-slate-300 print:text-black font-semibold truncate mr-2">
                {idx + 1}. {step.label || step.stage}
              </span>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="text-[10px] text-slate-400">{step.duration || 85} ms</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  {step.status || 'COMPLETED'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legal & Insurance Reconstruction */}
      <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-2 text-xs print:border-gray-300 print:bg-white">
        <div className="text-cyan-400 font-bold flex items-center gap-2 print:text-black">
          <ShieldCheck className="w-4 h-4" />
          <span>LEGAL & INSURANCE TELEMETRY RECONSTRUCTION</span>
        </div>
        <p className="text-slate-300 leading-relaxed print:text-gray-800">
          Reconstruction confirms a side-impact collision at an uncontrolled/yellow-signal urban intersection.
          College Bus (Vehicle A) approached at 42 km/h under wet road conditions requiring 41.2m stopping distance.
          Ola Car (Vehicle B) proceeded at 8 km/h across the bus approach vector.
          Deterministic AI Shadow calculated risk at 86% (CRITICAL) and broadcast dual driver alerts 1.8 seconds prior to impact.
          Automatic RescueFlow orchestrated multi-channel dispatch across 3 agencies and 3 family recipients under Highest Priority response.
        </p>
      </div>
    </div>
  );
}
