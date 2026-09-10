import React from 'react';
import { AlertOctagon, Shield, ShieldCheck, ArrowRight, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import CrashTelemetryCard from '../components/rescue/CrashTelemetryCard.jsx';
import DispatchCard from '../components/rescue/DispatchCard.jsx';
import EmergencyResponseTimeline from '../components/rescue/EmergencyResponseTimeline.jsx';
import IncidentReportView from '../components/rescue/IncidentReportView.jsx';
import PreventionInsightCard from '../components/rescue/PreventionInsightCard.jsx';

export default function RescueFlowAnalysis() {
  const navigate = useNavigate();
  const { activeIncident, triggerCollisionSimulation } = useApp();

  const isCollision = activeIncident ? Boolean(activeIncident.isCollision || (activeIncident.severityLevel && activeIncident.severityLevel !== 'SAFE')) : false;
  const isPrevention = activeIncident ? Boolean(activeIncident.isPrevention || activeIncident.status === 'PREVENTED' || activeIncident.severityLevel === 'SAFE') : false;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-navy-900 border border-slate-800 p-5 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {isPrevention ? (
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertOctagon className="w-5 h-5 text-red-400" />
            )}
            <h1 className="text-xl font-bold text-slate-100 font-mono tracking-tight">
              {isPrevention
                ? 'AI RESCUEFLOW — PROACTIVE COLLISION PREVENTION ANALYSIS'
                : 'AI RESCUEFLOW — POST-ACCIDENT INCIDENT ANALYSIS'}
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            {isPrevention
              ? 'Proactive collision prevention telemetry, stopping distance margin verification, and infrastructure safety recommendations.'
              : 'Automated post-crash telemetry reconstruction, g-force damage calculation, severity classification, and emergency dispatch tracking.'}
          </p>
        </div>

        {/* Action Button: Police Dashboard button ONLY for collision incidents after report generation */}
        {isCollision && activeIncident?.reportReady && (
          <button
            id="btn-go-to-police-dashboard"
            onClick={() => navigate('/police')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-mono text-xs font-bold inline-flex items-center gap-2 shadow-lg shadow-indigo-950/50 transition-all border border-indigo-400/40 animate-pulse"
          >
            <Shield className="w-4 h-4" />
            <span>Go to Police Dashboard</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        )}
      </div>

      {activeIncident ? (
        <div className="space-y-6">
          {/* For collision incidents: show crash telemetry, CAD dispatches, response timeline */}
          {isCollision && (
            <>
              <CrashTelemetryCard incident={activeIncident} />
              <DispatchCard dispatches={activeIncident.dispatches} />
              <EmergencyResponseTimeline timeline={activeIncident.responseTimeline} />
            </>
          )}

          {/* For prevention incidents: show safe clearance & kinematics overview */}
          {isPrevention && (
            <div className="bg-navy-900 border border-slate-800 rounded-2xl p-5 font-mono text-xs space-y-4 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-slate-100">PROACTIVE SAFETY CLEARANCE VERIFICATION</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                  CONFLICT PREVENTED
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">RISK SCORE</span>
                  <span className="font-bold text-emerald-400 text-sm">{activeIncident.severityScore ?? 15}%</span>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">HEADWAY CLEARANCE</span>
                  <span className="font-bold text-cyan-400 text-sm">Optimal (&gt;18m buffer)</span>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">VEHICLE A SPEED</span>
                  <span className="font-bold text-slate-200 text-sm">{activeIncident.vehicleA?.speed ?? 25} km/h</span>
                </div>
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">CAD DISPATCH</span>
                  <span className="font-bold text-slate-400 text-sm">Not Required (Safe)</span>
                </div>
              </div>
            </div>
          )}

          {/* Generated Report View (Incident or Prevention Report) */}
          <IncidentReportView incident={activeIncident} />

          {/* Prevention Insights */}
          <PreventionInsightCard insights={activeIncident.preventionInsights} />
        </div>
      ) : (
        <div className="bg-navy-900 border border-slate-800 rounded-xl p-12 text-center space-y-4 font-mono">
          <AlertOctagon className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300">NO ACTIVE INCIDENT OR PREDICTION LOGGED</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Select a scenario or upload a video in the Live Camera / Video tab to execute proactive prediction or trigger a simulation.
          </p>
          <button
            onClick={() => triggerCollisionSimulation()}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold inline-flex items-center gap-2"
          >
            TRIGGER SIMULATED COLLISION NOW
          </button>
        </div>
      )}
    </div>
  );
}
