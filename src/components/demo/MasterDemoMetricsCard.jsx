import React from 'react';
import { Clock, Activity, Zap, ShieldAlert, CheckCircle2, Cpu } from 'lucide-react';

export default function MasterDemoMetricsCard({ metrics = {}, isRunning = false }) {
  const {
    totalDemoDurationMs = 0,
    collisionProcessingTimeMs = 0,
    severityCalculationTimeMs = 0,
    locationResolutionTimeMs = 0,
    notificationGenerationTimeMs = 0,
    dispatchPlanningTimeMs = 0,
    blackboxGenerationTimeMs = 0,
    totalNotificationsGenerated = 0,
    timelineCompletionPercent = 100
  } = metrics;

  return (
    <div className="bg-navy-900 border border-slate-800 rounded-xl p-4 font-mono text-xs shadow-md space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-slate-100 uppercase tracking-wider text-[11px]">
            SYSTEM PERFORMANCE & LATENCY METRICS
          </h3>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
          isRunning
            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse'
            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
        }`}>
          {isRunning ? '● BENCHMARKING' : '● DETERMINISTIC CAPTURE'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
        {/* Total Duration */}
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
          <div className="text-slate-500 text-[10px] flex items-center justify-between">
            <span>TOTAL DURATION</span>
            <Clock className="w-3 h-3 text-cyan-400" />
          </div>
          <div className="text-sm font-bold text-slate-100 mt-1">
            {totalDemoDurationMs > 0 ? `${(totalDemoDurationMs / 1000).toFixed(2)}s` : '0.00s'}
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">End-to-End Cycle</div>
        </div>

        {/* Collision Processing */}
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
          <div className="text-slate-500 text-[10px] flex items-center justify-between">
            <span>COLLISION PROC.</span>
            <ShieldAlert className="w-3 h-3 text-red-400" />
          </div>
          <div className="text-sm font-bold text-red-400 mt-1">
            {collisionProcessingTimeMs} ms
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">RescueFlow Pipeline</div>
        </div>

        {/* Severity & Location Calc */}
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
          <div className="text-slate-500 text-[10px] flex items-center justify-between">
            <span>SEV & GPS RESOLVE</span>
            <Activity className="w-3 h-3 text-amber-400" />
          </div>
          <div className="text-sm font-bold text-amber-300 mt-1">
            {severityCalculationTimeMs + locationResolutionTimeMs} ms
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">
            Sev: {severityCalculationTimeMs}ms | GPS: {locationResolutionTimeMs}ms
          </div>
        </div>

        {/* Notification & Dispatch Plan */}
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
          <div className="text-slate-500 text-[10px] flex items-center justify-between">
            <span>NOTIF & DISPATCH</span>
            <Zap className="w-3 h-3 text-emerald-400" />
          </div>
          <div className="text-sm font-bold text-emerald-400 mt-1">
            {notificationGenerationTimeMs + dispatchPlanningTimeMs} ms
          </div>
          <div className="text-[9px] text-slate-500 mt-0.5">
            Plan: {dispatchPlanningTimeMs}ms | Gen: {notificationGenerationTimeMs}ms
          </div>
        </div>
      </div>

      {/* Second Row: Generation & Completion */}
      <div className="grid grid-cols-3 gap-3 text-[11px] pt-1">
        <div className="bg-slate-950/60 p-2 rounded border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400 text-[10px]">Total Notifications:</span>
          <span className="font-bold text-cyan-300">{totalNotificationsGenerated} Dispatches</span>
        </div>

        <div className="bg-slate-950/60 p-2 rounded border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400 text-[10px]">Timeline Completion:</span>
          <span className="font-bold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> {timelineCompletionPercent}%
          </span>
        </div>

        <div className="bg-slate-950/60 p-2 rounded border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400 text-[10px]">Blackbox Gen Time:</span>
          <span className="font-bold text-indigo-300">{blackboxGenerationTimeMs} ms</span>
        </div>
      </div>
    </div>
  );
}
