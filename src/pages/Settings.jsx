import React, { useState } from 'react';
import { Settings, Volume2, VolumeX, Shield, Database, Cpu, CheckCircle2, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import EmergencySettingsPanel from '../components/emergency/EmergencySettingsPanel.jsx';

export default function SettingsPage() {
  const { soundEnabled, setSoundEnabled } = useApp();

  const [highThreshold, setHighThreshold] = useState(56);
  const [criticalThreshold, setCriticalThreshold] = useState(76);
  const [fallbackMode, setFallbackMode] = useState(true);
  const [healthStatus, setHealthStatus] = useState(null);

  const checkHealth = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) setHealthStatus(await res.json());
    } catch (e) {
      setHealthStatus({ status: 'OFFLINE_FALLBACK', mode: 'CLIENT_PHYSICS_ENGINE' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-navy-900 border border-slate-800 p-5 rounded-2xl shadow-md">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl font-bold text-slate-100 font-mono tracking-tight">
            SYSTEM SETTINGS & CONFIGURATION
          </h1>
        </div>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Configure risk thresholds, emergency agency radio channels, sound alerts, and diagnostic health checks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        {/* RISK THRESHOLD CONFIG */}
        <div className="bg-navy-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-slate-100 text-sm border-b border-slate-800 pb-2">
            PREDICTED RISK THRESHOLD SETTINGS
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>HIGH RISK THRESHOLD (%)</span>
                <span className="text-orange-400 font-bold">{highThreshold}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="70"
                value={highThreshold}
                onChange={(e) => setHighThreshold(Number(e.target.value))}
                className="w-full accent-orange-500 bg-slate-800 rounded h-1.5 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>CRITICAL RISK THRESHOLD (%)</span>
                <span className="text-red-400 font-bold">{criticalThreshold}%</span>
              </div>
              <input
                type="range"
                min="70"
                max="90"
                value={criticalThreshold}
                onChange={(e) => setCriticalThreshold(Number(e.target.value))}
                className="w-full accent-red-500 bg-slate-800 rounded h-1.5 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* AUDIO & OFFLINE ENGINE SETTINGS */}
        <div className="bg-navy-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-slate-100 text-sm border-b border-slate-800 pb-2">
            AUDIO & ENGINE PREFERENCES
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <div>
                <div className="text-slate-200 font-bold">Audio EOC Warning Beep</div>
                <div className="text-[10px] text-slate-400">Play Web Audio synthesizer alert when risk crosses HIGH</div>
              </div>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-lg border ${soundEnabled ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40' : 'bg-slate-800 text-slate-500 border-slate-700'}`}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between bg-slate-950/80 p-3 rounded-lg border border-slate-800">
              <div>
                <div className="text-slate-200 font-bold">Deterministic Fallback Engine</div>
                <div className="text-[10px] text-slate-400">Use physics-backed local math without external API dependency</div>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/30">
                ENABLED
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* EMERGENCY COORDINATION SETTINGS */}
      <EmergencySettingsPanel />

      {/* SYSTEM DIAGNOSTIC HEALTH CHECK */}
      <div className="bg-navy-900 border border-slate-800 rounded-xl p-5 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h3 className="font-bold text-slate-100 text-sm">BACKEND & DATABASE DIAGNOSTIC HEALTHCHECK</h3>
          </div>
          <button
            onClick={checkHealth}
            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Test Healthcheck Endpoint
          </button>
        </div>

        {healthStatus ? (
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
            <div className="text-emerald-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              STATUS: {healthStatus.status}
            </div>
            <div>System: {healthStatus.system}</div>
            <div>Mode: {healthStatus.mode}</div>
            <div className="text-slate-500 text-[10px]">Ping Time: {healthStatus.timestamp || new Date().toISOString()}</div>
          </div>
        ) : (
          <p className="text-slate-500">Click "Test Healthcheck Endpoint" to verify Node/Express/SQLite backend connection.</p>
        )}
      </div>
    </div>
  );
}
