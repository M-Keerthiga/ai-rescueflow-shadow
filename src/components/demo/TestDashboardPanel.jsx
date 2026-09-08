import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import TestEvidenceModal from './TestEvidenceModal.jsx';

export default function TestDashboardPanel({ testResults }) {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedTest, setSelectedTest] = useState(null);

  if (!testResults || !testResults.results) return null;

  const alertPolicyTests = testResults.results.filter((r) => r.testId.startsWith('TC-ALERT'));
  const stateMachineTests = testResults.results.filter((r) => r.testId.startsWith('TC-STATE'));

  return (
    <div className="bg-navy-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md font-mono text-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 bg-slate-950/80 hover:bg-slate-950 flex items-center justify-between border-b border-slate-800 transition-all"
      >
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-cyan-400" />
          <div className="text-left">
            <h3 className="font-bold text-slate-100 text-sm tracking-wide">
              MASTER TEST VERIFICATION DASHBOARD (46 TESTS)
            </h3>
            <p className="text-[11px] text-slate-400">
              Alert Policy (22) + State Machine (24) — Actual Engine Assertion Verification
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
              PASS: {testResults.passCount}
            </span>
            <span className="px-2.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-bold">
              FAIL: {testResults.failCount}
            </span>
            <span className="px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
              NOT VERIFIED: {testResults.notVerifiedCount}
            </span>
          </div>
          {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-5 space-y-6">
          {/* ALERT POLICY TESTS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-[11px] font-bold text-slate-400">
              <span>1. AI SHADOW ALERT POLICY VERIFICATION (22 TESTS)</span>
              <span className="text-cyan-400">TC-ALERT-001 ➔ TC-ALERT-022</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {alertPolicyTests.map((t) => (
                <div
                  key={t.testId}
                  onClick={() => setSelectedTest(t)}
                  className="bg-slate-950/80 hover:bg-slate-800/80 p-2.5 rounded-lg border border-slate-800/80 flex items-center justify-between cursor-pointer transition-all"
                >
                  <div className="truncate mr-2">
                    <span className="font-bold text-slate-200 mr-2">{t.testId}</span>
                    <span className="text-slate-400 text-[11px] truncate">{t.description}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      t.status === 'PASS'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : t.status === 'FAIL'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* STATE MACHINE TESTS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 text-[11px] font-bold text-slate-400">
              <span>2. AI SHADOW ALERT STATE MACHINE VERIFICATION (24 TESTS)</span>
              <span className="text-cyan-400">TC-STATE-001 ➔ TC-STATE-024</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {stateMachineTests.map((t) => (
                <div
                  key={t.testId}
                  onClick={() => setSelectedTest(t)}
                  className="bg-slate-950/80 hover:bg-slate-800/80 p-2.5 rounded-lg border border-slate-800/80 flex items-center justify-between cursor-pointer transition-all"
                >
                  <div className="truncate mr-2">
                    <span className="font-bold text-slate-200 mr-2">{t.testId}</span>
                    <span className="text-slate-400 text-[11px] truncate">{t.description}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      t.status === 'PASS'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : t.status === 'FAIL'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedTest && (
        <TestEvidenceModal testResult={selectedTest} onClose={() => setSelectedTest(null)} />
      )}
    </div>
  );
}
