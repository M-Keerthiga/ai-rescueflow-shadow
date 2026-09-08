import React from 'react';
import { AlertOctagon, Bus, Car, ShieldAlert, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export default function DriverAlertOverlay() {
  const { riskResult } = useApp();

  if (!riskResult) return null;

  const isHighOrCritical = riskResult.category === 'HIGH' || riskResult.category === 'CRITICAL';
  const riskPercent = riskResult.predictedCollisionRisk ?? 86;
  const category = riskResult.category || 'CRITICAL';
  const ttc = riskResult.estimatedTTC || riskResult.ttc || 1.8;

  if (!isHighOrCritical) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          NORMAL TRAFFIC FLOW — NO EVASIVE ALERTS ACTIVE
        </div>
        <p className="text-xs text-slate-500 mt-2 font-mono">
          Collision risk ({riskPercent}%) is within safe operational margins.
        </p>
      </div>
    );
  }

  const actA = riskResult.vehicleA?.recommendedAction || 'HARD BRAKING REQUIRED';
  const actB = riskResult.vehicleB?.recommendedAction || 'STOP NOW & YIELD';
  const vA = riskResult.vehicleA || { type: 'BUS #7', speed: 42, distance: 38, stoppingDistanceMeters: 41.2, isDeficit: true };
  const vB = riskResult.vehicleB || { type: 'CAR #12', speed: 8, distance: 22, stoppingDistanceMeters: 14.2, isDeficit: false };

  return (
    <div className="space-y-4">
      <div className="bg-red-500/10 border-2 border-red-500/60 rounded-xl p-4 text-red-300 animate-pulse flex items-center justify-between shadow-lg shadow-red-950/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500/40 flex items-center justify-center">
            <AlertOctagon className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-sm text-red-400 tracking-wider">
                SIMULTANEOUS DRIVER HUD ALERTS TRIGGERED
              </span>
              <span className="bg-red-500 text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                {category} RISK ({riskPercent}%)
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono mt-0.5">
              Estimated Time To Collision (TTC): <span className="text-white font-bold">{ttc} seconds</span>
            </p>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <span className="text-[10px] font-mono text-red-400 bg-red-950/80 px-2 py-1 rounded border border-red-800">
            AUTO EVASIVE BROADCAST
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* DRIVER A HUD: COLLEGE BUS */}
        <div className="bg-navy-900 border-2 border-amber-500/60 rounded-xl p-4 shadow-md space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[10px] font-mono font-bold px-2 py-0.5 rounded-bl">
            DRIVER A (TARGETED)
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">{vA.type || 'BUS #7'}</h3>
              <p className="text-xs font-mono text-slate-400">
                Speed: <span className="text-amber-400 font-semibold">{vA.speed ?? 42} km/h</span> | Dist to Impact: <span className="text-amber-400 font-semibold">{vA.distance ?? 38}m</span>
              </p>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 font-bold mb-1">
              <ShieldAlert className="w-4 h-4" />
              RECOMMENDED DRIVER ACTION:
            </div>
            <p className="text-xs text-amber-100 font-medium leading-relaxed">
              {actA}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-950/60 p-2 rounded border border-slate-800 text-slate-400">
            <div>Stopping Required: <span className="text-slate-200">{vA.stoppingDistanceMeters ?? 41.2}m</span></div>
            <div>Available Margin: <span className={vA.isDeficit ? 'text-red-400 font-bold' : 'text-emerald-400'}>{vA.isDeficit ? 'DEFICIT' : 'CLEAR'}</span></div>
          </div>
        </div>

        {/* DRIVER B HUD: OLA CAR */}
        <div className="bg-navy-900 border-2 border-cyan-500/60 rounded-xl p-4 shadow-md space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-cyan-500 text-slate-950 text-[10px] font-mono font-bold px-2 py-0.5 rounded-bl">
            DRIVER B (TARGETED)
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">{vB.type || 'CAR #12'}</h3>
              <p className="text-xs font-mono text-slate-400">
                Speed: <span className="text-cyan-400 font-semibold">{vB.speed ?? 8} km/h</span> | Dist to Impact: <span className="text-cyan-400 font-semibold">{vB.distance ?? 22}m</span>
              </p>
            </div>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-400 font-bold mb-1">
              <Zap className="w-4 h-4" />
              RECOMMENDED DRIVER ACTION:
            </div>
            <p className="text-xs text-cyan-100 font-medium leading-relaxed">
              {actB}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-950/60 p-2 rounded border border-slate-800 text-slate-400">
            <div>Stopping Required: <span className="text-slate-200">{vB.stoppingDistanceMeters ?? 14.2}m</span></div>
            <div>Available Margin: <span className={vB.isDeficit ? 'text-red-400 font-bold' : 'text-emerald-400'}>{vB.isDeficit ? 'DEFICIT' : 'CLEAR'}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
