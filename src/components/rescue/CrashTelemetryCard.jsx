import React from 'react';
import { Activity, ShieldAlert, Zap, AlertTriangle } from 'lucide-react';

export default function CrashTelemetryCard({ incident }) {
  if (!incident) return null;

  const impact = incident.impactAnalysis || {};
  const severity = incident.severity || {};

  return (
    <div className="bg-navy-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-red-400" />
          <h2 className="font-bold text-slate-100 text-sm font-mono tracking-wide">
            CRASH IMPACT TELEMETRY ANALYSIS
          </h2>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/40 uppercase">
          SEVERITY: {severity.level || 'CRITICAL'} ({severity.score || 88}/100)
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-xs">
        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
          <div className="text-slate-500 text-[10px]">RELATIVE IMPACT VELOCITY</div>
          <div className="text-xl font-bold text-red-400 mt-1">{impact.relativeImpactSpeedKmH || 46} km/h</div>
          <div className="text-[10px] text-slate-400 mt-0.5">90° T-Bone Cross Collision</div>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
          <div className="text-slate-500 text-[10px]">VEHICLE B G-FORCE</div>
          <div className="text-xl font-bold text-amber-400 mt-1">{impact.gForceVehicleB || 14.2} g</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Sedan Driver Side deceleration</div>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
          <div className="text-slate-500 text-[10px]">KINETIC ENERGY TRANSFER</div>
          <div className="text-xl font-bold text-cyan-400 mt-1">{impact.kineticEnergyKJ || 742} kJ</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Mass ratio 12:1.4 tons</div>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800">
          <div className="text-slate-500 text-[10px]">CASUALTY TRAUMA RISK</div>
          <div className="text-sm font-bold text-red-400 mt-1">{impact.casualtyRisk || 'HIGH (EXTRICATION REQ)'}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Hydraulic cutters required</div>
        </div>
      </div>

      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs font-mono space-y-1">
        <div className="text-slate-400 font-semibold flex items-center gap-1.5 text-[11px]">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          STRUCTURAL DEFORMATION:
        </div>
        <p className="text-slate-300">
          {impact.vehicleDeformation || 'SEVERE DRIVER-SIDE CABIN INTRUSION COMPROMISING SEDAN B-PILLAR.'}
        </p>
      </div>
    </div>
  );
}
