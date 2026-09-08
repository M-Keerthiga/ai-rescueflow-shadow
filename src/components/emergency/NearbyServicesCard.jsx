import React from 'react';
import { Hospital, ShieldAlert, Clock, Route, CheckCircle } from 'lucide-react';
import ServiceStatusBadge from './ServiceStatusBadge.jsx';

/**
 * NearbyServicesCard Component
 * Displays the nearest identified hospital and police station with transit metrics and readiness.
 * 
 * Props:
 * - hospital: { name, distanceKm, etaMinutes, availability, priority, phone }
 * - policeStation: { name, distanceKm, etaMinutes, availability, priority, phone }
 * - loading: boolean
 */
export default function NearbyServicesCard({ hospital, policeStation, loading = false }) {
  if (loading) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 animate-pulse">
        <div className="h-4 bg-slate-800 rounded w-1/3 mb-4" />
        <div className="space-y-4">
          <div className="h-12 bg-slate-800 rounded" />
          <div className="h-12 bg-slate-800 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Hospital className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
            Nearby Emergency Facilities
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-400 uppercase">
          HAVERSINE CAD ENGINE
        </span>
      </div>

      <div className="space-y-3 pt-3 font-mono text-xs">
        {/* Nearest Hospital Cardlet */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Hospital className="w-4 h-4" />
              </div>
              <div className="truncate">
                <span className="text-[10px] text-emerald-400 uppercase font-semibold block">
                  Nearest Hospital
                </span>
                <span className="text-slate-100 font-bold text-xs truncate block" title={hospital?.name}>
                  {hospital?.name || 'Metro General & Trauma Hospital'}
                </span>
              </div>
            </div>
            <ServiceStatusBadge
              status="READY"
              label={hospital?.availability || 'AVAILABLE'}
              size="sm"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800/60 text-[11px]">
            <div>
              <span className="text-[9px] text-slate-400 block uppercase">Distance</span>
              <div className="flex items-center gap-1 text-slate-200 font-semibold">
                <Route className="w-3 h-3 text-cyan-400" />
                <span>{hospital?.distanceKm || hospital?.distance || 2.5} km</span>
              </div>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 block uppercase">Transit ETA</span>
              <div className="flex items-center gap-1 text-cyan-300 font-bold">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>~{hospital?.etaMinutes || hospital?.ETA || 4} min</span>
              </div>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 block uppercase">Priority Tier</span>
              <span className="text-emerald-400 font-bold truncate block text-[10px]">
                {hospital?.priority || 'LEVEL_1_TRAUMA'}
              </span>
            </div>
          </div>
        </div>

        {/* Nearest Police Station Cardlet */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="p-1.5 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div className="truncate">
                <span className="text-[10px] text-indigo-400 uppercase font-semibold block">
                  Nearest Police Station
                </span>
                <span className="text-slate-100 font-bold text-xs truncate block" title={policeStation?.name}>
                  {policeStation?.name || 'SFPD Central Traffic Division'}
                </span>
              </div>
            </div>
            <ServiceStatusBadge
              status="DISPATCHED"
              label={policeStation?.availability || 'PATROL_READY'}
              size="sm"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800/60 text-[11px]">
            <div>
              <span className="text-[9px] text-slate-400 block uppercase">Distance</span>
              <div className="flex items-center gap-1 text-slate-200 font-semibold">
                <Route className="w-3 h-3 text-cyan-400" />
                <span>{policeStation?.distanceKm || policeStation?.distance || 1.8} km</span>
              </div>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 block uppercase">Transit ETA</span>
              <div className="flex items-center gap-1 text-cyan-300 font-bold">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>~{policeStation?.etaMinutes || policeStation?.ETA || 3} min</span>
              </div>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 block uppercase">Assignment</span>
              <span className="text-indigo-300 font-bold truncate block text-[10px]">
                {policeStation?.priority || 'RAPID_INTERCEPT'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
