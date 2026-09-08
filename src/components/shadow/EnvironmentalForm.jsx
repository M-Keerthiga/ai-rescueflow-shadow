import React from 'react';
import { Cloud, CloudRain, Sun, Zap, Navigation } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export default function EnvironmentalForm() {
  const { environment, updateEnvironment } = useApp();

  return (
    <div className="bg-navy-900 border border-slate-800 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Cloud className="w-4 h-4 text-cyan-400" />
        <h3 className="font-bold text-slate-100 text-xs font-mono uppercase tracking-wider">
          ENVIRONMENTAL & INTERSECTION MODIFIERS
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
        <div>
          <label className="text-slate-400 text-[11px] block mb-1">Road Condition</label>
          <select
            value={environment.roadCondition}
            onChange={(e) => updateEnvironment({ roadCondition: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded p-1.5"
          >
            <option value="dry">Dry Asphalt (μ = 0.8)</option>
            <option value="wet">Wet Surface (μ = 0.5)</option>
            <option value="icy">Icy / Slick (μ = 0.2)</option>
          </select>
        </div>

        <div>
          <label className="text-slate-400 text-[11px] block mb-1">Visibility</label>
          <select
            value={environment.visibility}
            onChange={(e) => updateEnvironment({ visibility: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded p-1.5"
          >
            <option value="good">Clear Daylight</option>
            <option value="moderate">Rain / Dusk</option>
            <option value="poor">Dense Fog / Heavy Rain</option>
          </select>
        </div>

        <div>
          <label className="text-slate-400 text-[11px] block mb-1">Traffic Density</label>
          <select
            value={environment.trafficDensity}
            onChange={(e) => updateEnvironment({ trafficDensity: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded p-1.5"
          >
            <option value="low">Low Traffic</option>
            <option value="moderate">Moderate Urban</option>
            <option value="high">High Congestion</option>
          </select>
        </div>

        <div>
          <label className="text-slate-400 text-[11px] block mb-1">Traffic Signal</label>
          <select
            value={environment.trafficSignal}
            onChange={(e) => updateEnvironment({ trafficSignal: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 rounded p-1.5"
          >
            <option value="green">Green (Proceed)</option>
            <option value="yellow">Yellow (Turning Red)</option>
            <option value="red">Red (Stop)</option>
            <option value="none">Uncontrolled Intersection</option>
          </select>
        </div>
      </div>
    </div>
  );
}
