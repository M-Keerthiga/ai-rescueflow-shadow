import React from 'react';
import { useApp } from '../../context/AppContext.jsx';

export default function VehicleOverlay() {
  const { riskResult, vehicleA, vehicleB } = useApp();

  if (!riskResult) return null;

  const ttc = riskResult.estimatedTTC || 1.8;
  const isCritical = riskResult.category === 'CRITICAL';
  const isHigh = riskResult.category === 'HIGH';

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {/* 1. BUS #7 OVERLAY */}
      <div
        className="absolute transition-all duration-300 border-2 border-amber-500 rounded bg-amber-500/10 shadow-lg shadow-amber-950/50 p-1.5 flex flex-col justify-between"
        style={{
          left: '32%',
          top: '48%',
          width: '120px',
          height: '110px'
        }}
      >
        <div className="flex items-center justify-between font-mono text-[10px] bg-amber-500 text-slate-950 px-1 py-0.5 rounded font-bold">
          <span>BUS #7</span>
          <span>94% CONF</span>
        </div>
        <div className="font-mono text-[10px] text-amber-300 space-y-0.5 bg-black/60 p-1 rounded backdrop-blur">
          <div>ESTIMATED SPEED: <strong className="text-white">{vehicleA?.speed ?? 42} km/h</strong></div>
          <div>ESTIMATED DISTANCE: <strong className="text-white">{vehicleA?.distance ?? 38} m</strong></div>
          <div>ESTIMATED TTC: <strong className="text-amber-400">{ttc} s</strong></div>
        </div>
      </div>

      {/* 2. CAR #12 OVERLAY */}
      <div
        className="absolute transition-all duration-300 border-2 border-cyan-500 rounded bg-cyan-500/10 shadow-lg shadow-cyan-950/50 p-1.5 flex flex-col justify-between"
        style={{
          left: '54%',
          top: '32%',
          width: '110px',
          height: '95px'
        }}
      >
        <div className="flex items-center justify-between font-mono text-[10px] bg-cyan-500 text-slate-950 px-1 py-0.5 rounded font-bold">
          <span>CAR #12</span>
          <span>89% CONF</span>
        </div>
        <div className="font-mono text-[10px] text-cyan-300 space-y-0.5 bg-black/60 p-1 rounded backdrop-blur">
          <div>ESTIMATED SPEED: <strong className="text-white">{vehicleB?.speed ?? 8} km/h</strong></div>
          <div>ESTIMATED DISTANCE: <strong className="text-white">{vehicleB?.distance ?? 22} m</strong></div>
          <div>ESTIMATED TTC: <strong className="text-cyan-400">{ttc} s</strong></div>
        </div>
      </div>

      {/* 3. INTERSECTION CONFLICT POINT */}
      {(isHigh || isCritical) && (
        <div
          className="absolute border-2 border-dashed border-red-500 rounded-full bg-red-500/20 flex flex-col items-center justify-center p-2 animate-pulse"
          style={{
            left: '46%',
            top: '42%',
            width: '90px',
            height: '90px',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <span className="text-[10px] font-mono font-extrabold text-red-400 text-center uppercase tracking-tighter">
            CONFLICT NODE
          </span>
          <span className="text-[9px] font-mono text-white font-bold bg-red-950/80 px-1 rounded">
            TTC: {ttc}s
          </span>
        </div>
      )}
    </div>
  );
}
