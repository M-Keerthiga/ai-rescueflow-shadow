import React from 'react';
import {
  AlertOctagon,
  Activity,
  MapPin,
  Hospital,
  Shield,
  Users,
  Send,
  Ambulance,
  Radio,
  CheckCircle2,
  Clock,
  CircleDot
} from 'lucide-react';
import ServiceStatusBadge from './ServiceStatusBadge.jsx';

/**
 * 10 Canonical Dispatch Stages in chronological sequence
 */
export const CANONICAL_TIMELINE_STAGES = [
  { id: 'INCIDENT_DETECTED', label: 'Incident Detected', icon: AlertOctagon },
  { id: 'SEVERITY_CALCULATED', label: 'Severity Calculated', icon: Activity },
  { id: 'LOCATION_VERIFIED', label: 'Location Verified', icon: MapPin },
  { id: 'HOSPITAL_SELECTED', label: 'Nearest Hospital Selected', icon: Hospital },
  { id: 'POLICE_SELECTED', label: 'Nearest Police Station Selected', icon: Shield },
  { id: 'FAMILY_NOTIFIED', label: 'Family Contacts Notified', icon: Users },
  { id: 'NOTIFICATIONS_GENERATED', label: 'Notifications Generated', icon: Send },
  { id: 'HOSPITAL_RESPONSE_PLANNED', label: 'Hospital Response Planned', icon: Ambulance },
  { id: 'POLICE_RESPONSE_PLANNED', label: 'Police Response Planned', icon: Radio },
  { id: 'INCIDENT_CLOSED', label: 'Incident Closed', icon: CheckCircle2 }
];

/**
 * Builds standard 10-step timeline events by merging raw timeline from backend or defaults.
 */
export function buildTenStageTimeline(rawTimeline = [], incidentContext = {}) {
  const safeList = Array.isArray(rawTimeline) ? rawTimeline : [];
  const safeContext = incidentContext || {};
  const baseTime = safeContext.timestamp ? new Date(safeContext.timestamp).getTime() : Date.now() - 15000;
  const isCompleted = safeContext.incidentStatus === 'COMPLETED' || safeContext.status === 'COMPLETED';

  return CANONICAL_TIMELINE_STAGES.map((stage, idx) => {
    // Attempt matching by stage identifier or index
    const matchedRaw = safeList.find(
      (r) => r && (r.stage?.toUpperCase() === stage.id || r.label?.toLowerCase() === stage.label.toLowerCase())
    ) || safeList[idx];

    const offsetMs = (idx + 1) * 1200;
    const itemTimestamp = matchedRaw?.timestamp || new Date(baseTime + offsetMs).toISOString();
    const duration = matchedRaw?.durationMs || matchedRaw?.duration || (85 + (idx * 25));

    let status = 'COMPLETED';
    if (!isCompleted && idx > 4) {
      status = idx === 5 ? 'IN_PROGRESS' : 'PENDING';
    }
    if (matchedRaw?.status) {
      status = String(matchedRaw.status).toUpperCase();
    }

    let detail = '';
    switch (stage.id) {
      case 'INCIDENT_DETECTED':
        detail = `Optical telemetry detected impact conflict between ${incidentContext.vehicle || 'Bus #7 & Car #12'}.`;
        break;
      case 'SEVERITY_CALCULATED':
        detail = `Severity classified as ${incidentContext.severity || 'CRITICAL'} with impact score 88/100.`;
        break;
      case 'LOCATION_VERIFIED':
        detail = `Coordinates locked to ${incidentContext.location?.roadName || 'Market Street Transit Corridor'} (${incidentContext.location?.GPS || '37.774900, -122.419400'}).`;
        break;
      case 'HOSPITAL_SELECTED':
        detail = `Selected facility: ${incidentContext.selectedHospital?.name || 'Metro General & Trauma Hospital'} (ETA ~4 mins).`;
        break;
      case 'POLICE_SELECTED':
        detail = `Selected station: ${incidentContext.selectedPoliceStation?.name || 'SFPD Central Traffic Division'} (ETA ~3 mins).`;
        break;
      case 'FAMILY_NOTIFIED':
        detail = `Deduplicated dispatch triggered for 3 registered family contacts.`;
        break;
      case 'NOTIFICATIONS_GENERATED':
        detail = `20 multi-channel transmissions generated across SMS, Phone, Email, and Push.`;
        break;
      case 'HOSPITAL_RESPONSE_PLANNED':
        detail = `Level 1 Trauma ALS unit scheduled for priority resuscitation bay intake.`;
        break;
      case 'POLICE_RESPONSE_PLANNED':
        detail = `Traffic corridor lockdown and intersection perimeter clearance coordinated.`;
        break;
      case 'INCIDENT_CLOSED':
        detail = `Emergency response fully planned. Simulation data archived in legal blackbox history.`;
        break;
      default:
        detail = matchedRaw?.detail || 'Step completed successfully.';
    }

    return {
      stage: stage.id,
      label: stage.label,
      icon: stage.icon,
      timestamp: itemTimestamp,
      duration,
      status,
      detail: matchedRaw?.detail || detail
    };
  });
}

/**
 * DispatchTimeline Component
 * Renders the 10-step incident lifecycle with durations, timestamps, and status badges.
 */
export default function DispatchTimeline({ timeline = [], incidentContext = {}, loading = false }) {
  if (loading) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 animate-pulse space-y-4">
        <div className="h-5 bg-slate-800 rounded w-1/4" />
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-slate-800/60 rounded" />
          ))}
        </div>
      </div>
    );
  }

  const stages = buildTenStageTimeline(timeline, incidentContext);
  const totalDuration = stages.reduce((sum, s) => sum + (Number(s.duration) || 0), 0);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm font-mono text-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            DISPATCH RESPONSE TIMELINE
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            10-Stage Deterministic Incident Progression — Chronological Lifecycle Log
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded bg-slate-800 text-cyan-300 border border-slate-700 text-[11px] font-semibold">
            Total Execution: {totalDuration} ms
          </span>
          <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
            10 STAGES RECORDED
          </span>
        </div>
      </div>

      <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {stages.map((step, idx) => {
          const IconComponent = step.icon || CircleDot;
          const isLast = idx === stages.length - 1;

          const isCompleted = step.status === 'COMPLETED';
          const isInProgress = step.status === 'IN_PROGRESS';
          const isFailed = step.status === 'FAILED';

          const nodeColor = isCompleted
            ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-emerald-950/50'
            : isInProgress
            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-amber-950/50 animate-pulse'
            : isFailed
            ? 'bg-red-500 text-white border-red-400'
            : 'bg-slate-800 text-slate-400 border-slate-700';

          return (
            <div
              key={step.stage || idx}
              className="relative bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 hover:border-slate-700 transition-colors"
            >
              {/* Timeline Connector Icon */}
              <div
                className={`absolute -left-[30px] sm:-left-[38px] top-3.5 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold shadow-md ${nodeColor}`}
              >
                <IconComponent className="w-3 h-3" />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                    STAGE {idx + 1}/10
                  </span>
                  <span className="font-bold text-slate-100 text-xs sm:text-sm">
                    {step.label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-mono">
                    {step.duration} ms
                  </span>
                  <ServiceStatusBadge status={step.status} size="sm" />
                </div>
              </div>

              <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
                {step.detail}
              </p>

              <div className="text-[10px] text-slate-400 mt-1 text-right">
                {new Date(step.timestamp).toLocaleTimeString()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
