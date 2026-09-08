import React from 'react';
import { Lightbulb, ArrowUpRight, ShieldCheck, Cpu } from 'lucide-react';

export default function PreventionInsightCard({ insights }) {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="bg-navy-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h2 className="font-bold text-slate-100 text-sm font-mono tracking-wide">
            PREVENTION INSIGHTS & INFRASTRUCTURE RECOMMENDATIONS
          </h2>
        </div>
        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
          CLOSED-LOOP SAFETY FEEDBACK
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {insights.map((item, idx) => (
          <div key={idx} className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3 relative flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  {item.category}
                </span>
                <span className={`text-[10px] font-mono font-bold ${item.priority === 'HIGH' ? 'text-red-400' : 'text-amber-400'}`}>
                  {item.priority} PRIORITY
                </span>
              </div>
              <h3 className="font-bold text-slate-100 text-xs font-mono">{item.title}</h3>
              <p className="text-xs text-slate-400 font-mono leading-relaxed">
                {item.recommendation}
              </p>
            </div>

            <div className="bg-slate-900 p-2.5 rounded border border-slate-800/80 text-[11px] font-mono text-emerald-400 flex items-center justify-between mt-2">
              <span>{item.impact}</span>
              <ArrowUpRight className="w-4 h-4 shrink-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
