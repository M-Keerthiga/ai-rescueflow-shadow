import React from 'react';
import { AlertTriangle, Ambulance, Shield, Clock, Layers, CheckCircle2 } from 'lucide-react';
import ServiceStatusBadge from './ServiceStatusBadge.jsx';

/**
 * DispatchSummaryCard Component
 * Summarizes the active multi-agency dispatch plan, assigned units, priority tier, and arrival window.
 * 
 * Props:
 * - dispatchPlan: Array of dispatch objects
 * - severity: string (LOW, MODERATE, HIGH, CRITICAL, CATASTROPHIC)
 * - responsePriority: string (e.g. "Highest Priority")
 * - selectedHospital: object
 * - selectedPoliceStation: object
 * - currentStage: string
 * - loading: boolean
 */
export default function DispatchSummaryCard({
  dispatchPlan = [],
  severity = 'CRITICAL',
  responsePriority = 'Highest Priority',
  selectedHospital = null,
  selectedPoliceStation = null,
  currentStage = 'ORCHESTRATION_COMPLETED',
  loading = false
}) {
  if (loading) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 animate-pulse">
        <div className="h-4 bg-slate-800 rounded w-1/3 mb-4" />
        <div className="space-y-3">
          <div className="h-4 bg-slate-800 rounded w-full" />
          <div className="h-4 bg-slate-800 rounded w-5/6" />
        </div>
      </div>
    );
  }

  const hospName = selectedHospital?.name || 'Metro General Trauma Center';
  const policeName = selectedPoliceStation?.name || 'Central Traffic Division Patrol';
  const primaryEta = selectedHospital?.etaMinutes || selectedPoliceStation?.etaMinutes || 4;

  const severityColor = {
    LOW: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
    MODERATE: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    HIGH: 'text-orange-400 border-orange-500/40 bg-orange-500/10',
    CRITICAL: 'text-red-400 border-red-500/40 bg-red-500/10',
    CATASTROPHIC: 'text-rose-400 border-rose-500/40 bg-rose-500/15'
  }[String(severity).toUpperCase()] || 'text-amber-400 border-amber-500/40 bg-amber-500/10';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
            Dispatch Plan Summary
          </h3>
        </div>
        <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${severityColor}`}>
          {responsePriority || `${severity} Priority`}
        </span>
      </div>

      <div className="space-y-2.5 pt-3 font-mono text-xs">
        {/* Key Assigned Units Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="bg-slate-950/60 border border-slate-800/70 p-2.5 rounded-lg space-y-1">
            <span className="text-[9px] text-slate-400 uppercase block">Assigned Medical Unit</span>
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px] truncate">
              <Ambulance className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{hospName}</span>
            </div>
            <div className="text-[10px] text-slate-400">Level 1 ALS Life Support</div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/70 p-2.5 rounded-lg space-y-1">
            <span className="text-[9px] text-slate-400 uppercase block">Assigned Tactical Patrol</span>
            <div className="flex items-center gap-1.5 text-indigo-400 font-semibold text-[11px] truncate">
              <Shield className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{policeName}</span>
            </div>
            <div className="text-[10px] text-slate-400">Corridor Lockdown Interceptor</div>
          </div>
        </div>

        {/* Arrival Window & Stage */}
        <div className="bg-slate-950/60 border border-slate-800/70 p-2.5 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="text-[9px] text-slate-400 block uppercase">Est. On-Scene Arrival</span>
              <span className="text-slate-100 font-bold text-xs">~{primaryEta} Minutes</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[9px] text-slate-400 block uppercase">Timeline Stage</span>
            <span className="text-[10px] text-cyan-300 font-semibold">
              {currentStage?.replace(/_/g, ' ') || 'DISPATCH INITIATED'}
            </span>
          </div>
        </div>

        {/* Total Active Dispatches Pill */}
        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/60 text-slate-400">
          <span>Active Units Mobilized</span>
          <div className="flex items-center gap-1.5 font-bold text-slate-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{dispatchPlan.length > 0 ? dispatchPlan.length : 3} Dispatched Agencies</span>
          </div>
        </div>
      </div>
    </div>
  );
}
