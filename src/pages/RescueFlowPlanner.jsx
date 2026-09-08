import React from 'react';
import { Ambulance, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import DispatchCard from '../components/rescue/DispatchCard.jsx';
import EmergencyResponseTimeline from '../components/rescue/EmergencyResponseTimeline.jsx';

export default function RescueFlowPlanner() {
  const { activeIncident } = useApp();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="bg-navy-900 border border-slate-800 p-5 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Ambulance className="w-5 h-5 text-cyan-400" />
            <h1 className="text-xl font-bold text-slate-100 font-mono tracking-tight">
              AI RESCUEFLOW — EMERGENCY RESPONSE PLANNER
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time CAD automated dispatch coordination, ambulance ETAs, fire tender routing, traffic patrol diversion, and tow clearance.
          </p>
        </div>

        <button
          onClick={() => navigate('/rescue/report')}
          className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-2"
        >
          View Incident Report <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {activeIncident ? (
        <div className="space-y-6">
          <DispatchCard dispatches={activeIncident.dispatches} />
          <EmergencyResponseTimeline timeline={activeIncident.responseTimeline} />
        </div>
      ) : (
        <div className="bg-navy-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 font-mono text-xs">
          No active dispatch plan available. Trigger a collision to initialize AI RescueFlow.
        </div>
      )}
    </div>
  );
}
