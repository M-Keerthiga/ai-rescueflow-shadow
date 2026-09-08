import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertOctagon, Ambulance, FileText, ArrowRight, Play } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import CrashTelemetryCard from '../components/rescue/CrashTelemetryCard.jsx';
import DispatchCard from '../components/rescue/DispatchCard.jsx';
import EmergencyResponseTimeline from '../components/rescue/EmergencyResponseTimeline.jsx';

export default function RescueFlowAnalysis() {
  const { activeIncident, triggerCollisionSimulation } = useApp();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="bg-navy-900 border border-slate-800 p-5 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-red-400" />
            <h1 className="text-xl font-bold text-slate-100 font-mono tracking-tight">
              AI RESCUEFLOW — POST-ACCIDENT INCIDENT ANALYSIS
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Automated post-crash telemetry reconstruction, g-force damage calculation, severity classification, and immediate dispatch trigger.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => triggerCollisionSimulation()}
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            RE-RUN CRASH SIMULATION
          </button>
          <button
            onClick={() => navigate('/rescue/planner')}
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-2 shadow-md shadow-cyan-950/40"
          >
            Go to Response Planner <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {activeIncident ? (
        <div className="space-y-6">
          <CrashTelemetryCard incident={activeIncident} />
          <DispatchCard dispatches={activeIncident.dispatches} />
          <EmergencyResponseTimeline timeline={activeIncident.responseTimeline} />
        </div>
      ) : (
        <div className="bg-navy-900 border border-slate-800 rounded-xl p-12 text-center space-y-4">
          <AlertOctagon className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-300 font-mono">NO ACTIVE INCIDENT LOGGED</h3>
          <p className="text-xs text-slate-500 font-mono max-w-md mx-auto">
            Click "Simulate Collision" in the top bar or run "Auto Demo Mode" to trigger an accident and initiate AI RescueFlow.
          </p>
          <button
            onClick={() => triggerCollisionSimulation()}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold inline-flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-current" />
            TRIGGER SIMULATED COLLISION NOW
          </button>
        </div>
      )}
    </div>
  );
}
