import React from 'react';
import { Eye, Navigation, ShieldAlert } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export default function TrackingPanel() {
  const { vehicleA, vehicleB, riskResult, selectedClipData } = useApp();
  const ttc = riskResult?.estimatedTTC || 1.8;

  return (
    <div className="bg-navy-900 border border-slate-800 rounded-xl p-4 space-y-3 font-mono text-xs shadow-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-slate-100 uppercase text-xs">PERSISTENT OBJECT TRACKER MATRIX</h3>
        </div>
        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          2 OBJECTS TRACKED
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-[11px] border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-500">
              <th className="pb-1.5">PERSISTENT ID</th>
              <th className="pb-1.5">CLASS</th>
              <th className="pb-1.5">ESTIMATED SPEED</th>
              <th className="pb-1.5">ESTIMATED DISTANCE</th>
              <th className="pb-1.5">ESTIMATED TTC</th>
              <th className="pb-1.5">HAZARD STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            <tr><td className="py-2 font-bold text-amber-400">{vehicleA?.type || 'BUS #7'}</td><td>heavy_bus</td><td className="font-bold">{vehicleA?.speed ?? 42} km/h</td><td>{vehicleA?.distance ?? 38} m</td><td className="text-amber-400 font-bold">{ttc} s</td><td><span className="text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">STOPPING DEFICIT</span></td></tr>
            <tr><td className="py-2 font-bold text-cyan-400">{vehicleB?.type || 'CAR #12'}</td><td>passenger_car</td><td className="font-bold">{vehicleB?.speed ?? 8} km/h</td><td>{vehicleB?.distance ?? 22} m</td><td className="text-cyan-400 font-bold">{ttc} s</td><td><span className="text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded">CROSSING PATH</span></td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
