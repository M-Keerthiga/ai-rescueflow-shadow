import React, { useState } from 'react';
import { Sliders, RefreshCw, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import { calculateRisk } from '../../server/services/riskEngine.js';

export default function AIShadowWhatIf() {
  const { vehicleA, vehicleB, environment, riskResult } = useApp();

  // Simulated scenario state
  const [simA, setSimA] = useState({ ...vehicleA, speed: 30, brakingCapability: 'good' });
  const [simB, setSimB] = useState({ ...vehicleB, speed: 5, distance: 30 });
  const [simEnv, setSimEnv] = useState({ ...environment, roadCondition: 'dry', trafficSignal: 'green' });

  // Calculate simulated scenario risk
  const simResult = calculateRisk(simA, simB, simEnv);
  const baseResult = riskResult || calculateRisk(vehicleA, vehicleB, environment);

  const riskDiff = simResult.predictedCollisionRisk - baseResult.predictedCollisionRisk;

  return (
    <div className="space-y-6">
      <div className="bg-navy-900 border border-slate-800 p-5 rounded-2xl shadow-md">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl font-bold text-slate-100 font-mono tracking-tight">
            WHAT-IF RISK SENSITIVITY SIMULATOR
          </h1>
        </div>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Instantly simulate intervention strategies (e.g. lowering bus speed, activating ABS, or changing traffic light signals) to test collision risk reduction.
        </p>
      </div>

      {/* Comparison Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* BASELINE SCENARIO CARD */}
        <div className="bg-navy-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono font-bold text-slate-400">BASELINE SCENARIO</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              CURRENT SCENARIO
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold font-mono text-slate-100">
                {baseResult.predictedCollisionRisk}%
              </div>
              <div className="text-xs font-mono text-slate-400 uppercase mt-0.5">
                Category: <span className="text-amber-400 font-bold">{baseResult.category}</span>
              </div>
            </div>
            <div className="text-right font-mono text-xs text-slate-400">
              <div>TTC: {baseResult.ttc}s</div>
              <div>Bus Stop: {baseResult.vehicleA.stoppingDistanceMeters}m</div>
            </div>
          </div>
        </div>

        {/* RISK DIFFERENTIAL COMPARISON */}
        <div className="bg-navy-900 border-2 border-cyan-500/40 rounded-xl p-5 flex flex-col items-center justify-center text-center space-y-2 shadow-lg shadow-cyan-950/20">
          <span className="text-xs font-mono text-cyan-400 font-bold">SAFETY INTERVENTION DELTA</span>
          <div className={`text-4xl font-extrabold font-mono ${riskDiff <= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {riskDiff > 0 ? `+${riskDiff}%` : `${riskDiff}%`}
          </div>
          <p className="text-xs text-slate-300 font-mono">
            {riskDiff <= 0
              ? `Safety intervention reduces predicted collision risk by ${Math.abs(riskDiff)}%.`
              : `Warning: This configuration increases risk by ${riskDiff}%.`}
          </p>
        </div>

        {/* SIMULATED SCENARIO CARD */}
        <div className="bg-navy-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-mono font-bold text-cyan-400">SIMULATED WHAT-IF SCENARIO</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              LIVE TUNING
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold font-mono text-cyan-300">
                {simResult.predictedCollisionRisk}%
              </div>
              <div className="text-xs font-mono text-slate-400 uppercase mt-0.5">
                Category: <span className="text-emerald-400 font-bold">{simResult.category}</span>
              </div>
            </div>
            <div className="text-right font-mono text-xs text-slate-400">
              <div>TTC: {simResult.ttc}s</div>
              <div>Bus Stop: {simResult.vehicleA.stoppingDistanceMeters}m</div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Controls Grid */}
      <div className="bg-navy-900 border border-slate-800 rounded-xl p-5 space-y-6">
        <h3 className="font-bold text-slate-100 text-sm font-mono tracking-wide border-b border-slate-800 pb-3">
          TUNE WHAT-IF SIMULATION PARAMETERS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
          {/* SIMULATED BUS CONTROLS */}
          <div className="space-y-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div className="font-bold text-amber-400 flex items-center justify-between">
              <span>BUS SPEED & BRAKING INTERVENTION</span>
              <span>{simA.speed} km/h</span>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Simulated Bus Speed (km/h)</label>
              <input
                type="range"
                min="0"
                max="80"
                value={simA.speed}
                onChange={(e) => setSimA({ ...simA, speed: Number(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer bg-slate-800 rounded h-1.5"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Bus Braking Efficiency</label>
              <select
                value={simA.brakingCapability}
                onChange={(e) => setSimA({ ...simA, brakingCapability: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded p-2"
              >
                <option value="poor">Poor Brakes (μ=0.6)</option>
                <option value="medium">Standard Brakes (μ=0.8)</option>
                <option value="good">Enhanced ABS / New Brakes (μ=1.0)</option>
              </select>
            </div>
          </div>

          {/* SIMULATED ROAD & SIGNAL CONTROLS */}
          <div className="space-y-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div className="font-bold text-cyan-400 flex items-center justify-between">
              <span>ROAD FRICTION & SIGNAL CONTROL</span>
              <span>{simEnv.roadCondition.toUpperCase()}</span>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Road Surface Friction</label>
              <select
                value={simEnv.roadCondition}
                onChange={(e) => setSimEnv({ ...simEnv, roadCondition: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded p-2"
              >
                <option value="dry">Dry Asphalt (High Friction)</option>
                <option value="wet">Wet Surface (Medium Friction)</option>
                <option value="icy">Slick Asphalt (Low Friction)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Intersection Traffic Signal</label>
              <select
                value={simEnv.trafficSignal}
                onChange={(e) => setSimEnv({ ...simEnv, trafficSignal: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded p-2"
              >
                <option value="green">Green (Normal Clearance)</option>
                <option value="yellow">Yellow (Turning Red)</option>
                <option value="red">Red (All Stop Hazard)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Dynamic Explanation */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono space-y-1">
          <div className="text-cyan-400 font-bold">DETERMINISTIC WHAT-IF EVALUATION SUMMARY:</div>
          <p className="text-slate-300 leading-relaxed">
            {simResult.explanation}
          </p>
        </div>
      </div>
    </div>
  );
}
