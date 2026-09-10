import React, { useEffect, useState } from 'react';
import { Activity, AlertOctagon, Bell, FileText, Gauge, Radio, Shield, Siren, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

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
  const { riskResult, activeIncident, incidentsList, alertsList, analyticsData, visionStatus } = useApp();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch('/api/emergency/history')
      .then((response) => response.ok ? response.json() : null)
      .then((data) => setNotifications(data?.notificationHistory || []))
      .catch(() => setNotifications([]));
  }, [activeIncident]);

  const latestReport = activeIncident?.report || incidentsList[0]?.report;
  const emergencyStatus = activeIncident?.status || activeIncident?.incidentStatus || 'STANDBY';
  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="bg-navy-900 border border-slate-800 p-5 rounded-2xl shadow-md">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl font-bold text-slate-100 font-mono tracking-tight">OPERATIONAL COMMAND CENTER</h1>
        </div>
        <p className="text-xs text-slate-400 font-mono mt-1">System summary dashboard</p>
      </div>

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
            <SummaryValue label="Response State" value={emergencyStatus} tone="text-emerald-400" />
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

