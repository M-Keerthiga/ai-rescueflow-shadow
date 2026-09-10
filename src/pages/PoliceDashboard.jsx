import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EmergencyCoordinatorPanel from '../components/emergency/EmergencyCoordinatorPanel.jsx';

export default function PoliceDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header with quick back navigation */}
      <div className="bg-navy-900 border border-slate-800 p-5 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            <h1 className="text-xl font-bold text-slate-100 font-mono tracking-tight">
              POLICE TRAFFIC PATROL & EMERGENCY DISPATCH DASHBOARD
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Real-time Metropolitan Police CAD integration, highway patrol interceptor dispatch, automated corridor lockdown, and agency coordination.
          </p>
        </div>

        <button
          onClick={() => navigate('/rescue/analysis')}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-mono text-xs font-bold inline-flex items-center gap-2 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Incident Analysis
        </button>
      </div>

      {/* Embedded Master Emergency Coordination & Police Dispatch Component */}
      <EmergencyCoordinatorPanel />
    </div>
  );
}
