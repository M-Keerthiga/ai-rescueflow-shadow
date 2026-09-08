import React from 'react';
import { Cpu, Activity, Gauge, Eye } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export default function TelemetryPanel() {
  const { visionStatus, confidenceThresh, frameSampling } = useApp();

  return (
    <div className="bg-navy-900 border border-slate-800 rounded-xl p-4 space-y-3 font-mono text-xs shadow-md">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <Activity className="w-4 h-4 text-cyan-400" />
        <h3 className="font-bold text-slate-100 uppercase text-xs">VISION SYSTEM TELEMETRY STATS</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
        <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
          <div className="text-slate-500 text-[10px]">INFERENCE ENGINE</div>
          <div className="font-bold text-cyan-400 mt-0.5">{visionStatus?.source || 'CV_SERVICE'}</div>
        </div>

        <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
          <div className="text-slate-500 text-[10px]">CONFIDENCE THRESH</div>
          <div className="font-bold text-slate-200 mt-0.5">{Math.round(confidenceThresh * 100)}%</div>
        </div>

        <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
          <div className="text-slate-500 text-[10px]">FRAME SAMPLING</div>
          <div className="font-bold text-slate-200 mt-0.5">{frameSampling}x (Skip {frameSampling - 1})</div>
        </div>

        <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
          <div className="text-slate-500 text-[10px]">HOMOGRAPHY MATRIX</div>
          <div className="font-bold text-emerald-400 mt-0.5">CALIBRATED</div>
        </div>
      </div>
    </div>
  );
}
