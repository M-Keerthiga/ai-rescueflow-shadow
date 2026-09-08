import React from 'react';
import { Ambulance, Shield, Flame, Truck, Phone, Radio, MapPin } from 'lucide-react';

export default function DispatchCard({ dispatches }) {
  if (!dispatches || dispatches.length === 0) return null;

  const getIcon = (type) => {
    if (type.includes('Ambulance') || type.includes('Medical')) return Ambulance;
    if (type.includes('Fire') || type.includes('Rescue')) return Flame;
    if (type.includes('Patrol') || type.includes('Police')) return Shield;
    return Truck;
  };

  return (
    <div className="bg-navy-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-md">
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
        <div className="flex items-center gap-2">
          <Ambulance className="w-5 h-5 text-cyan-400" />
          <h2 className="font-bold text-slate-100 text-sm font-mono tracking-wide">
            AUTOMATED EMERGENCY DISPATCH MATRIX
          </h2>
        </div>
        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/30">
          SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dispatches.map((unit, idx) => {
          const Icon = getIcon(unit.type);
          return (
            <div key={idx} className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-xs font-mono">{unit.unitId}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">{unit.agency}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  unit.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                  unit.status === 'DISPATCHED' ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 animate-pulse' :
                  'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {unit.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-900 p-2.5 rounded border border-slate-800/80 text-slate-300">
                <div className="flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Channel: {unit.contactChannel}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Dist: {unit.distanceKm} km (ETA: <strong className="text-white">{unit.etaMinutes}m</strong>)</span>
                </div>
              </div>

              <div className="text-[11px] font-mono text-slate-400 leading-relaxed bg-slate-900/40 p-2 rounded">
                <span className="text-slate-500">ASSIGNED TASK:</span> {unit.assignedAction}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
