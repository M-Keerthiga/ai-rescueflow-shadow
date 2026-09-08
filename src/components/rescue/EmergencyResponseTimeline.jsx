import React from 'react';
import { Clock, CheckCircle2, Circle, ArrowRight } from 'lucide-react';

export default function EmergencyResponseTimeline({ timeline }) {
  if (!timeline || timeline.length === 0) return null;

  return (
    <div className="bg-navy-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-md">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          <h2 className="font-bold text-slate-100 text-sm font-mono tracking-wide">
            AUTOMATED RESPONSE PROGRESSION TIMELINE
          </h2>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
          AI RESCUEFLOW WORKFLOW
        </span>
      </div>

      <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
        {timeline.map((item, idx) => {
          const isDone = item.status === 'COMPLETED';
          const isInProgress = item.status === 'IN_PROGRESS';

          return (
            <div key={idx} className="relative flex items-start gap-4 pl-8">
              {/* Status Circle */}
              <div
                className={`absolute left-0 top-0.5 w-7 h-7 rounded-full flex items-center justify-center border text-xs font-mono font-bold z-10 ${
                  isDone
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : isInProgress
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 animate-pulse'
                    : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>

              <div className="flex-1 bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-xs font-mono space-y-1">
                <div className="flex justify-between items-center">
                  <span className={`font-bold ${isDone ? 'text-emerald-400' : isInProgress ? 'text-cyan-400' : 'text-slate-300'}`}>
                    {item.label}
                  </span>
                  <span className="text-[10px] text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                    {item.time}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {item.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
