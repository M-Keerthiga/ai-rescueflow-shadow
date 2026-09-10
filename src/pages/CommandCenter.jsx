import React, { useEffect, useState } from 'react';
import {
  Activity,
  AlertOctagon,
  Bell,
  FileText,
  Gauge,
  Radio,
  Shield,
  Siren,
  TrendingUp,
  Hospital,
  Ambulance,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { SIMULATION_DISCLAIMER } from '../services/hospitalService.js';

function SummarySection({ title, icon: Icon, children }) {
  return (
    <section className="bg-navy-900 border border-slate-800 rounded-xl p-4 shadow-md">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
        <Icon className="w-4 h-4 text-cyan-400" />
        <h2 className="text-xs font-bold text-slate-100 font-mono uppercase">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function SummaryValue({ label, value, tone = 'text-slate-100' }) {
  return (
    <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3">
      <div className="text-[10px] text-slate-500 font-mono uppercase">{label}</div>
      <div className={`text-lg font-bold font-mono mt-1 ${tone}`}>{value}</div>
    </div>
  );
}

export default function CommandCenter() {
  const {
    riskResult,
    activeIncident,
    incidentsList,
    alertsList,
    analyticsData,
    visionStatus,
    policeStatus,
    hospitalStatus,
    assignedHospital,
    assignedAmbulance,
    ambulanceTracking
  } = useApp();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch('/api/emergency/history')
      .then((response) => response.ok ? response.json() : null)
      .then((data) => setNotifications(data?.notificationHistory || []))
      .catch(() => setNotifications([]));
  }, [activeIncident]);

  const latestReport = activeIncident?.report || incidentsList[0]?.report;
  const recentNotifications = notifications.slice(0, 5);

  const isCompleted = ambulanceTracking.status === 'ARRIVED_AT_SCENE' || hospitalStatus === 'ARRIVED_AT_SCENE';
  const isEnRoute = ambulanceTracking.status === 'EN_ROUTE' || policeStatus === 'EN_ROUTE';

  return (
    <div className="space-y-6">
      {/* Permanent Simulation Disclaimer Banner */}
      <div className="bg-amber-500/15 border border-amber-500/40 p-3 rounded-xl flex items-center justify-between flex-wrap gap-2 text-amber-300 font-mono text-xs font-bold shadow-md">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="uppercase tracking-wider">{SIMULATION_DISCLAIMER}</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
          OPERATIONAL SUMMARY ONLY
        </span>
      </div>

      <div className="bg-navy-900 border border-slate-800 p-5 rounded-2xl shadow-md">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl font-bold text-slate-100 font-mono tracking-tight">OPERATIONAL COMMAND CENTER</h1>
        </div>
        <p className="text-xs text-slate-400 font-mono mt-1">Multi-Agency Incident Summary & Dispatch Telemetry Dashboard</p>
      </div>

      {/* ========================================================================= */}
      {/* MULTI-AGENCY POST-ACCIDENT WORKFLOW SUMMARY (AUTO-UPDATING) */}
      {/* ========================================================================= */}
      <SummarySection title="Post-Accident Multi-Agency Dispatch Summary" icon={Siren}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
          {/* Latest Incident */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-1">
            <div className="text-[10px] text-slate-500 uppercase flex items-center justify-between">
              <span>Latest Incident</span>
              <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded ${activeIncident?.severityLevel === 'SAFE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                {activeIncident?.severityLevel || 'NO INCIDENT'}
              </span>
            </div>
            <div className="text-sm font-bold text-cyan-300 truncate">
              {activeIncident?.id || activeIncident?.incidentId || 'Standby (No Incident)'}
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {activeIncident?.location || 'Tamil Nadu Road Corridor'}
            </div>
          </div>

          {/* Police Status */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-1">
            <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1.5">
              <Shield className="w-3 h-3 text-indigo-400" />
              <span>Police Status</span>
            </div>
            <div className={`text-sm font-bold truncate ${isEnRoute ? 'text-cyan-300' : 'text-slate-200'}`}>
              {policeStatus === 'EN_ROUTE' ? 'CAD En Route to Scene' : policeStatus}
            </div>
            <div className="text-[10px] text-indigo-300">
              Corridor Management: {isEnRoute || isCompleted ? 'Lockdown Active' : 'Standby'}
            </div>
          </div>

          {/* Hospital Status */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-1">
            <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1.5">
              <Hospital className="w-3 h-3 text-emerald-400" />
              <span>Hospital Status</span>
            </div>
            <div className="text-sm font-bold text-emerald-300 truncate" title={assignedHospital?.name}>
              {assignedHospital ? assignedHospital.name : 'Awaiting Assignment'}
            </div>
            <div className="text-[10px] text-slate-400">
              {hospitalStatus === 'AMBULANCE_DISPATCHED' ? 'Emergency Dispatch Active' : hospitalStatus}
            </div>
          </div>

          {/* Ambulance Status */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-1">
            <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1.5">
              <Ambulance className="w-3 h-3 text-amber-400" />
              <span>Ambulance Status</span>
            </div>
            <div className="text-sm font-bold text-amber-400 truncate">
              {assignedAmbulance?.ambulanceId || 'TN-108-ALS-04'}
            </div>
            <div className="text-[10px] text-slate-400">
              State: <strong className="text-slate-200">{ambulanceTracking.status}</strong>
            </div>
          </div>

          {/* Current Incident State */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-1">
            <div className="text-[10px] text-slate-500 uppercase">Current Incident State</div>
            <div className="text-sm font-bold text-slate-100 truncate">
              {activeIncident?.status || 'STANDBY'}
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              Location: {ambulanceTracking.currentLocation}
            </div>
          </div>

          {/* Estimated Arrival Time */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-1">
            <div className="text-[10px] text-slate-500 uppercase flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-cyan-400" />
              <span>Estimated Arrival Time</span>
            </div>
            <div className="text-sm font-bold text-cyan-400">
              {isCompleted
                ? '0.0 min (ON SCENE)'
                : `${ambulanceTracking.etaMinutes || (assignedHospital?.etaMinutes ?? 3.5)} mins`}
            </div>
            <div className="text-[10px] text-slate-400">
              Speed: {ambulanceTracking.speedKmH ? `${ambulanceTracking.speedKmH} km/h` : '0 km/h'}
            </div>
          </div>

          {/* Dispatch Progress */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-1 col-span-1 sm:col-span-2">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span className="uppercase">Dispatch Progress</span>
              <span className="font-bold text-emerald-400">{ambulanceTracking.progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800 mt-1">
              <div
                className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-500"
                style={{ width: `${ambulanceTracking.progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-slate-500 pt-1">
              <span>{assignedHospital ? assignedHospital.name.slice(0, 18) + '...' : 'Hospital'}</span>
              <span>{isCompleted ? 'ARRIVED AT SCENE' : 'IN TRANSIT'}</span>
              <span>{activeIncident?.location ? activeIncident.location.slice(0, 18) + '...' : 'Scene'}</span>
            </div>
          </div>

          {/* Completion Status */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-1 col-span-1 sm:col-span-2 lg:col-span-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : 'text-amber-400'}`} />
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Completion Status</span>
                <span className={`text-xs font-bold ${isCompleted ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isCompleted
                    ? 'DISPATCH COMPLETED — AMBULANCE ARRIVED AT SCENE & PATIENT CARE ENGAGED'
                    : isEnRoute
                    ? 'DISPATCH ACTIVE — AMBULANCE IN ROUTE TO ACCIDENT SCENE'
                    : 'AWAITING POLICE & HOSPITAL DISPATCH ACKNOWLEDGEMENT'}
                </span>
              </div>
            </div>
            <span className="text-[10px] text-slate-500">
              Workflow managed via Police & Hospital Dashboards
            </span>
          </div>
        </div>
      </SummarySection>

      <SummarySection title="Current System Status" icon={Radio}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <SummaryValue label="Vision Service" value={visionStatus?.modelStatus || 'UNKNOWN'} tone="text-emerald-400" />
          <SummaryValue label="Incident Records" value={incidentsList.length} />
          <SummaryValue label="Alert Records" value={alertsList.length} />
        </div>
      </SummarySection>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SummarySection title="Current Collision Risk" icon={Gauge}>
          <div className="grid grid-cols-2 gap-3">
            <SummaryValue label="Risk Score" value={`${riskResult?.predictedCollisionRisk ?? 0}%`} tone="text-amber-400" />
            <SummaryValue label="Category" value={riskResult?.category || 'SAFE'} tone="text-cyan-300" />
            <SummaryValue label="TTC" value={`${riskResult?.estimatedTTC ?? 'N/A'} sec`} />
            <SummaryValue label="Relative Speed" value={`${riskResult?.relativeVelocityKmH ?? 0} km/h`} />
          </div>
        </SummarySection>

        <SummarySection title="Latest Prediction Summary" icon={Activity}>
          <p className="text-xs text-slate-300 font-mono leading-relaxed">
            {riskResult?.explanation || 'No prediction summary available.'}
          </p>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <SummaryValue label="Vehicle A" value={riskResult?.vehicleA?.type || 'N/A'} />
            <SummaryValue label="Vehicle B" value={riskResult?.vehicleB?.type || 'N/A'} />
          </div>
        </SummarySection>

        <SummarySection title="Active Incident" icon={AlertOctagon}>
          {activeIncident ? (
            <div className="grid grid-cols-2 gap-3">
              <SummaryValue label="Incident ID" value={activeIncident.id || 'N/A'} />
              <SummaryValue label="Severity" value={activeIncident.severityLevel || activeIncident.severity?.level || 'N/A'} tone="text-red-400" />
              <SummaryValue label="Status" value={activeIncident.status || 'ACTIVE'} />
              <SummaryValue label="Impact Speed" value={`${activeIncident.impactSpeedKmH ?? 'N/A'} km/h`} />
            </div>
          ) : <p className="text-xs text-slate-400 font-mono">No active incident.</p>}
        </SummarySection>

        <SummarySection title="Last Generated Report" icon={FileText}>
          {latestReport ? (
            <div className="space-y-2 text-xs font-mono text-slate-300">
              <div className="text-cyan-300 font-bold">{latestReport.incidentId || activeIncident?.id || 'Latest incident report'}</div>
              <div>{latestReport.status || 'Report generated'}</div>
              <div className="text-slate-500">{latestReport.timestamp || activeIncident?.timestamp || 'Timestamp unavailable'}</div>
            </div>
          ) : <p className="text-xs text-slate-400 font-mono">No report generated.</p>}
        </SummarySection>

        <SummarySection title="Emergency Status" icon={Siren}>
          <div className="grid grid-cols-2 gap-3">
            <SummaryValue label="Response State" value={activeIncident?.status || 'STANDBY'} tone="text-emerald-400" />
            <SummaryValue label="Dispatches" value={activeIncident?.dispatches?.length ?? 0} />
          </div>
        </SummarySection>

        <SummarySection title="Recent Notifications" icon={Bell}>
          {recentNotifications.length > 0 ? (
            <div className="space-y-2">
              {recentNotifications.map((notification, index) => (
                <div key={notification.notificationId || index} className="flex items-center justify-between gap-3 border-b border-slate-800/70 pb-2 text-xs font-mono">
                  <span className="text-slate-300 truncate">{notification.recipientName || notification.recipientType || 'Notification'}</span>
                  <span className="text-cyan-300 shrink-0">{notification.status || 'RECORDED'}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-xs text-slate-400 font-mono">No recent notifications.</p>}
        </SummarySection>
      </div>

      <SummarySection title="Overall Statistics" icon={TrendingUp}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <SummaryValue label="Total Incidents" value={analyticsData?.totalIncidents ?? incidentsList.length} />
          <SummaryValue label="Total Alerts" value={analyticsData?.totalAlerts ?? alertsList.length} />
          <SummaryValue label="Prevented Collisions" value={analyticsData?.preventedCollisionsEstimate ?? 0} tone="text-emerald-400" />
          <SummaryValue label="Avg Dispatch Time" value={`${analyticsData?.avgDispatchTimeMinutes ?? 0} min`} />
        </div>
      </SummarySection>
    </div>
  );
}

