import React from 'react';
import { X, CheckCircle2, XCircle, AlertCircle, FileText } from 'lucide-react';

export default function TestEvidenceModal({ testResult, onClose }) {
  if (!testResult) return null;

  const isPass = testResult.status === 'PASS';
  const isFail = testResult.status === 'FAIL';
  const ev = testResult.evidence || {};

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-navy-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl font-mono text-xs text-slate-200 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center text-slate-950 font-bold ${
              isPass ? 'bg-emerald-400' : isFail ? 'bg-red-500 text-white' : 'bg-amber-400'
            }`}
          >
            {isPass ? <CheckCircle2 className="w-5 h-5" /> : isFail ? <XCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-100">{testResult.testId}</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isPass ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                  isFail ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                  'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}
              >
                {testResult.status}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">{testResult.description}</p>
          </div>
        </div>

        {testResult.failureReason && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-300 text-[11px]">
            <strong>FAILURE REASON:</strong> {testResult.failureReason}
          </div>
        )}

        <div className="space-y-2">
          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">ENGINE TELEMETRY EVIDENCE</div>
          <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px]">
            <div>Calculated Risk: <span className="text-amber-400 font-bold">{ev.riskScore !== undefined ? `${ev.riskScore}%` : 'N/A'}</span></div>
            <div>Risk Category: <span className="text-slate-200 font-bold">{ev.riskCategory || 'N/A'}</span></div>
            <div>Estimated TTC: <span className="text-cyan-400 font-bold">{ev.estimatedTTC !== undefined ? `${ev.estimatedTTC}s` : 'N/A'}</span></div>
            <div>Alert State: <span className="text-slate-200 font-bold">{ev.currentState || 'N/A'}</span></div>
            <div>Measured Latency: <span className="text-slate-300">{testResult.latencyMs !== undefined ? `${testResult.latencyMs} ms` : 'N/A'}</span></div>
            <div>Timestamp: <span className="text-slate-400 text-[10px]">{testResult.startTime ? new Date(testResult.startTime).toLocaleTimeString() : 'N/A'}</span></div>
          </div>
        </div>

        <div className="space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px]">
          <div className="text-cyan-400 font-bold">TARGETED DRIVER ACTIONS GENERATED:</div>
          <div>Driver A (Bus #7): <span className="text-amber-200">{ev.driverAAction || 'N/A'}</span></div>
          <div>Driver B (Car #12): <span className="text-cyan-200">{ev.driverBAction || 'N/A'}</span></div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200"
          >
            Close Evidence Window
          </button>
        </div>
      </div>
    </div>
  );
}
