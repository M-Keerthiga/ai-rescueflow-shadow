import React from 'react';
import {
  CheckCircle2,
  Shield,
  Hospital,
  ShieldAlert,
  Users,
  Clock,
  RotateCcw,
  FileText,
  AlertTriangle,
  X
} from 'lucide-react';

export default function MasterDemoSummaryModal({
  isOpen = false,
  onClose = () => {},
  onReplay = () => {},
  scenarioResult = null
}) {
  if (!isOpen || !scenarioResult) return null;

  const isPrevention = scenarioResult.mode === 'prevention';
  const {
    incidentId = 'INC-88912',
    severity = 'CRITICAL',
    responsePriority = 'Highest Priority',
    selectedHospital,
    selectedPoliceStation,
    familyRecipients = [],
    notifications = [],
    metrics = {},
    preventionResult = {}
  } = scenarioResult;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-navy-900 border border-slate-700 w-full max-w-2xl rounded-2xl p-6 shadow-2xl space-y-5 font-mono text-xs text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              isPrevention
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                : 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-400'
            }`}>
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 tracking-tight">
                {isPrevention ? 'MASTER DEMO — PREVENTION SCENARIO COMPLETE' : 'MASTER DEMO — COLLISION RESPONSE COMPLETE'}
              </h2>
              <p className="text-[11px] text-slate-400">
                End-to-end automated execution summary & verification audit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Permanent Simulation Notice */}
        <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-xl flex items-center gap-2 text-amber-300 font-bold text-[10px]">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED</span>
        </div>

        {/* Details Breakdown */}
        {isPrevention ? (
          <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800/80">
              <span className="text-slate-400">Outcome:</span>
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold">
                COLLISION AVOIDED & RISK REDUCED
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Prevention Successful:</span>
              <span className="text-emerald-300 font-bold">YES — 0 Injury / 0 Structural Contact</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Emergency Orchestrator:</span>
              <span className="text-slate-400">INACTIVE (No False Dispatches)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Notifications Required:</span>
              <span className="text-slate-400 font-bold">0 Dispatches Generated</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Timeline Completion:</span>
              <span className="text-emerald-400 font-bold">100% Verified</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-800/80">
              <div>
                <span className="text-slate-500 text-[10px] block">INCIDENT ID</span>
                <strong className="text-cyan-300 text-sm">{incidentId}</strong>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">SEVERITY / PRIORITY</span>
                <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/40 font-bold text-[10px]">
                  {severity} ({responsePriority})
                </span>
              </div>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Hospital className="w-3.5 h-3.5 text-rose-400" /> Nearest Hospital:
                </span>
                <span className="text-slate-200 font-bold">
                  {selectedHospital?.name || 'San Francisco General Hospital'} ({selectedHospital?.distanceKm || '2.4'} km, ETA {selectedHospital?.etaMinutes || '4'}m)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-blue-400" /> Nearest Police Station:
                </span>
                <span className="text-slate-200 font-bold">
                  {selectedPoliceStation?.name || 'SFPD Central Station'} ({selectedPoliceStation?.distanceKm || '1.8'} km, ETA {selectedPoliceStation?.etaMinutes || '3'}m)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-cyan-400" /> Family Contacts Notified:
                </span>
                <span className="text-cyan-300 font-bold">
                  {familyRecipients?.length || 3} Registered Contacts (Spouse, Parent, Sibling)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Total Notifications Generated:</span>
                <span className="text-emerald-400 font-bold font-mono">
                  {notifications?.length || metrics?.totalNotificationsGenerated || 20} Multi-Channel Transmissions
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Blackbox Incident Report:</span>
                <span className="text-indigo-400 font-bold flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" /> Generated & Sealed
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Final Incident Status:</span>
                <span className="text-emerald-400 font-bold">COMPLETED (100% Resolved)</span>
              </div>
            </div>
          </div>
        )}

        {/* Latency Summary */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] grid grid-cols-3 gap-2 text-center">
          <div>
            <span className="text-slate-500 text-[10px] block">TOTAL DURATION</span>
            <strong className="text-slate-200 font-bold">
              {metrics?.totalDemoDurationMs ? `${(metrics.totalDemoDurationMs / 1000).toFixed(2)}s` : '0.48s'}
            </strong>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">COLLISION PROC.</span>
            <strong className="text-red-400 font-bold">
              {metrics?.collisionProcessingTimeMs || 0} ms
            </strong>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">NOTIF GENERATION</span>
            <strong className="text-emerald-400 font-bold">
              {metrics?.notificationGenerationTimeMs || 0} ms
            </strong>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <span className="text-[10px] text-slate-500">
            Auto-reset enabled • Ready for replay
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onReplay();
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold flex items-center gap-1.5 shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Replay Master Demo
            </button>
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
