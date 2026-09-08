import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export default function SafetyBanner() {
  return (
    <div className="bg-navy-900 border-b border-slate-800 text-xs py-2 px-4 flex flex-wrap items-center justify-between text-slate-400 gap-2">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
          <AlertTriangle className="w-3.5 h-3.5" />
          SYSTEM DISCLAIMER
        </span>
        <span>
          AI-generated risk estimate — not a certified collision-warning system.
        </span>
      </div>

      <div className="flex items-center gap-3 text-slate-400">
        <span className="inline-flex items-center gap-1.5 text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          SIMULATION MODE ACTIVE
        </span>
        <span className="hidden md:inline text-slate-500">|</span>
        <span className="font-mono text-[11px] text-slate-400">
          SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED
        </span>
      </div>
    </div>
  );
}
