import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Play, Volume2, VolumeX, Activity, Cpu, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import DetectionStatus from '../vision/DetectionStatus.jsx';

export default function Header() {
  const { riskResult, soundEnabled, setSoundEnabled, runDemoMode, isDemoRunning, demoStep } = useApp();
  const [selectedPath, setSelectedPath] = useState('collision');
  const navigate = useNavigate();

  const getRiskColor = (cat) => {
    switch (cat) {
      case 'CRITICAL': return 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse';
      case 'HIGH': return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'CAUTION': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <header className="bg-navy-900 border-b border-slate-800/80 px-4 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold tracking-tight text-slate-100 text-lg">AI RESCUEFLOW SHADOW</h1>
            <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              EOC CV MVP
            </span>
          </div>
          <DetectionStatus />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Live Risk Status Badge */}
        {riskResult && (
          <div className={`px-3 py-1 rounded-md text-xs font-mono font-semibold border flex items-center gap-2 ${getRiskColor(riskResult.category)}`}>
            <Activity className="w-3.5 h-3.5" />
            <span>PREDICTED RISK: {riskResult.predictedCollisionRisk}%</span>
            <span className="uppercase text-[10px] px-1 py-0.2 rounded bg-black/40">
              {riskResult.category}
            </span>
          </div>
        )}

        {/* Audio Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`p-2 rounded-lg border transition-all text-xs flex items-center gap-1.5 ${
            soundEnabled
              ? 'bg-slate-800 text-cyan-400 border-cyan-500/40 hover:bg-slate-700'
              : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
          }`}
          title={soundEnabled ? 'Mute Alert Sound' : 'Enable Alert Sound'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Demo Path Selector */}
        <select
          value={selectedPath}
          onChange={(e) => setSelectedPath(e.target.value)}
          disabled={isDemoRunning}
          className="bg-slate-950 border border-slate-800 text-slate-300 text-xs font-mono rounded-lg px-2 py-1.5"
        >
          <option value="collision">Demo Path: Collision ➔ RescueFlow</option>
          <option value="prevention">Demo Path: Driver Response ➔ Avoided</option>
        </select>

        {/* Demo Mode Trigger Button */}
        <button
          onClick={() => runDemoMode(selectedPath, navigate)}
          disabled={isDemoRunning}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 border shadow-sm transition-all ${
            isDemoRunning
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 cursor-wait animate-pulse'
              : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white border-cyan-400/40 shadow-cyan-900/30'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>{isDemoRunning ? `DEMO RUNNING (${demoStep}/6)` : 'START DEMO MODE'}</span>
        </button>
      </div>
    </header>
  );
}
