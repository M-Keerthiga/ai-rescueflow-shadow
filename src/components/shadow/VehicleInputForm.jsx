import React from 'react';
import { Bus, Car, Sliders } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export default function VehicleInputForm() {
  const { vehicleA, updateVehicleA, vehicleB, updateVehicleB } = useApp();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* VEHICLE A INPUTS (COLLEGE BUS) */}
      <div className="bg-navy-900 border border-slate-800 rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Bus className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-slate-100 text-sm font-mono">VEHICLE A: COLLEGE BUS</h3>
          </div>
          <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">
            HEAVY VEHICLE
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 font-mono mb-1">
              <span>Approach Speed:</span>
              <span className="text-amber-400 font-bold">{vehicleA.speed} km/h</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="1"
              value={vehicleA.speed}
              onChange={(e) => updateVehicleA({ speed: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer bg-slate-800 rounded h-1.5"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-mono mb-1">
              <span>Distance to Intersection:</span>
              <span className="text-amber-400 font-bold">{vehicleA.distance} m</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              step="1"
              value={vehicleA.distance}
              onChange={(e) => updateVehicleA({ distance: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer bg-slate-800 rounded h-1.5"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400 text-[11px] block font-mono mb-1">Braking Capability</label>
              <select
                value={vehicleA.brakingCapability}
                onChange={(e) => updateVehicleA({ brakingCapability: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded p-1.5 text-xs font-mono"
              >
                <option value="poor">Poor (Heavy Wear)</option>
                <option value="medium">Medium (Standard)</option>
                <option value="good">Good (ABS Active)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 text-[11px] block font-mono mb-1">Reaction Delay</label>
              <select
                value={vehicleA.reactionTime}
                onChange={(e) => updateVehicleA({ reactionTime: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded p-1.5 text-xs font-mono"
              >
                <option value={0.8}>0.8s (Alert)</option>
                <option value={1.2}>1.2s (Normal)</option>
                <option value={1.8}>1.8s (Distracted)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* VEHICLE B INPUTS (OLA CAR) */}
      <div className="bg-navy-900 border border-slate-800 rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Car className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-slate-100 text-sm font-mono">VEHICLE B: OLA CAR</h3>
          </div>
          <span className="text-[10px] font-mono bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-500/20">
            PASSENGER SEDAN
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div>
            <div className="flex justify-between text-slate-300 font-mono mb-1">
              <span>Approach Speed:</span>
              <span className="text-cyan-400 font-bold">{vehicleB.speed} km/h</span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="1"
              value={vehicleB.speed}
              onChange={(e) => updateVehicleB({ speed: Number(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer bg-slate-800 rounded h-1.5"
            />
          </div>

          <div>
            <div className="flex justify-between text-slate-300 font-mono mb-1">
              <span>Distance to Intersection:</span>
              <span className="text-cyan-400 font-bold">{vehicleB.distance} m</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              step="1"
              value={vehicleB.distance}
              onChange={(e) => updateVehicleB({ distance: Number(e.target.value) })}
              className="w-full accent-cyan-500 cursor-pointer bg-slate-800 rounded h-1.5"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-400 text-[11px] block font-mono mb-1">Braking Capability</label>
              <select
                value={vehicleB.brakingCapability}
                onChange={(e) => updateVehicleB({ brakingCapability: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded p-1.5 text-xs font-mono"
              >
                <option value="poor">Poor</option>
                <option value="medium">Medium</option>
                <option value="good">Good</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 text-[11px] block font-mono mb-1">Reaction Delay</label>
              <select
                value={vehicleB.reactionTime}
                onChange={(e) => updateVehicleB({ reactionTime: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded p-1.5 text-xs font-mono"
              >
                <option value={0.8}>0.8s (Alert)</option>
                <option value={1.0}>1.0s (Normal)</option>
                <option value={1.5}>1.5s (Delayed)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
