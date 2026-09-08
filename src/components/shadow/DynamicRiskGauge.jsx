import React from 'react';
import { Shield, AlertCircle, Info, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export default function DynamicRiskGauge() {
  const { riskResult } = useApp();

  const riskPercent = Number(riskResult?.predictedCollisionRisk) || 30;
  const category = riskResult?.category || 'LOW';

  const getGaugeColor = (cat) => {
    switch (cat) {
      case 'CRITICAL': return '#ef4444';
      case 'HIGH': return '#f97316';
      case 'CAUTION': return '#f59e0b';
      default: return '#10b981';
    }
  };

  const strokeColor = getGaugeColor(category);

  // SVG Gauge calculations (semi-circle)
  const radius = 70;
  const circumference = Math.PI * radius; // Half circle
  const strokeDashoffset = circumference - (riskPercent / 100) * circumference;

  return (
    <div className="bg-navy-900 border border-slate-800 rounded-xl p-5 shadow-md flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          <h2 className="font-bold text-slate-100 text-sm tracking-wide font-mono">
            PREDICTED COLLISION RISK
          </h2>
        </div>
        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
          category === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
          category === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
          category === 'CAUTION' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
          'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
        }`}>
          {category}
        </span>
      </div>

      {/* Radial Gauge Meter */}
      <div className="flex flex-col items-center justify-center py-2 relative">
        <svg width="200" height="120" viewBox="0 0 200 120" className="overflow-visible">
          {/* Background Arc */}
          <path
            d="M 20,110 A 70,70 0 0,1 180,110"
            fill="none"
            stroke="#1e293b"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Active Risk Arc */}
          <path
            d="M 20,110 A 70,70 0 0,1 180,110"
            fill="none"
            stroke={strokeColor}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Inner Counter Text */}
        <div className="absolute top-10 flex flex-col items-center">
          <span className="text-4xl font-extrabold font-mono text-slate-100 tracking-tight">
            {riskPercent}%
          </span>
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mt-0.5">
            Collision Risk
          </span>
        </div>
      </div>

      {/* Physics & Telemetry Quick Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950/60 p-3 rounded-lg border border-slate-800">
        <div>
          <span className="text-slate-500">TTC:</span>{' '}
          <span className="text-cyan-300 font-bold">{riskResult?.estimatedTTC || riskResult?.ttc || 1.8}s</span>
        </div>
        <div>
          <span className="text-slate-500">Rel Speed:</span>{' '}
          <span className="text-cyan-300 font-bold">{riskResult?.relativeVelocityKmH || 48} km/h</span>
        </div>
        <div>
          <span className="text-slate-500">Bus Stopping:</span>{' '}
          <span className={riskResult?.vehicleA?.isDeficit ? 'text-red-400 font-bold' : 'text-slate-300'}>{riskResult?.vehicleA?.stoppingDistanceMeters ?? 41.2}m</span>
        </div>
        <div>
          <span className="text-slate-500">Car Stopping:</span>{' '}
          <span className={riskResult?.vehicleB?.isDeficit ? 'text-red-400 font-bold' : 'text-slate-300'}>{riskResult?.vehicleB?.stoppingDistanceMeters ?? 14.2}m</span>
        </div>
      </div>

      {/* Key Drivers List */}
      <div className="space-y-1.5 pt-2 border-t border-slate-800">
        <div className="text-[11px] font-mono text-slate-400 font-semibold flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          KEY RISK DRIVERS (EXPLAINABLE):
        </div>
        <div className="space-y-1">
          {(riskResult?.riskDrivers || [
            { name: 'Bus Kinetic Energy & Mass', impact: 'CRITICAL', value: '12,000 kg @ 42 km/h' },
            { name: 'Intersection Conflict Window', impact: 'HIGH', value: 'TTC 1.8s Margin' },
            { name: 'Stopping Distance Deficit', impact: 'CRITICAL', value: '41.2m Req > 38m Avail' }
          ]).map((driver, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs font-mono bg-slate-900 px-2 py-1 rounded border border-slate-800/80">
              <span className="text-slate-300">{driver.name}</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                driver.impact === 'CRITICAL' ? 'text-red-400 bg-red-500/10' :
                driver.impact === 'HIGH' ? 'text-orange-400 bg-orange-500/10' :
                'text-slate-400 bg-slate-800'
              }`}>
                {driver.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Explanation Box */}
      <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1">
        <div className="flex items-center gap-1.5 text-cyan-400 font-semibold font-mono text-[11px]">
          <Info className="w-3.5 h-3.5" />
          DETERMINISTIC AI EXPLANATION
        </div>
        <p className="text-slate-400 leading-relaxed text-[11px]">
          {riskResult?.explanation || 'Physics engine predicts conflict at intersection node due to heavy vehicle stopping deficit and crossing trajectory conflict.'}
        </p>
      </div>
    </div>
  );
}
