import React from 'react';
import { Cpu, ShieldCheck, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export default function DetectionStatus() {
  const { visionStatus } = useApp();

  const status = visionStatus?.modelStatus || 'DEMO_TELEMETRY';
  const isTrained = status === 'TRAINED_MODEL';
  const isPretrained = status === 'PRETRAINED_MODEL';

  return (
    <div className="flex items-center gap-2">
      <div className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold border flex items-center gap-1.5 ${
        isTrained
          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
          : isPretrained
          ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
          : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
      }`}>
        <Cpu className="w-3.5 h-3.5" />
        <span>
          {isTrained
            ? 'VISION MODEL ACTIVE (TRAINED MODEL)'
            : isPretrained
            ? 'VISION MODEL ACTIVE (PRETRAINED MODEL)'
            : 'DEMO TELEMETRY ACTIVE'}
        </span>
      </div>

      <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
        {isTrained || isPretrained ? 'ONNX / PyTorch Inference' : 'Controlled Demo Fallback'}
      </span>
    </div>
  );
}
