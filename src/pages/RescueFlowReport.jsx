import React from 'react';
import { FileText, Lightbulb } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import IncidentReportView from '../components/rescue/IncidentReportView.jsx';
import PreventionInsightCard from '../components/rescue/PreventionInsightCard.jsx';

export default function RescueFlowReport() {
  const { activeIncident } = useApp();

  return (
    <div className="space-y-6">
      <div className="bg-navy-900 border border-slate-800 p-5 rounded-2xl shadow-md">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl font-bold text-slate-100 font-mono tracking-tight">
            BLACKBOX INCIDENT REPORT & PREVENTION INSIGHTS
          </h1>
        </div>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Finalized blackbox legal audit report, telemetry reconstruction, and closed-loop infrastructure safety insights.
        </p>
      </div>

      {activeIncident ? (
        <div className="space-y-6">
          <IncidentReportView incident={activeIncident} />
          <PreventionInsightCard insights={activeIncident.preventionInsights} />
        </div>
      ) : (
        <div className="bg-navy-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 font-mono text-xs">
          No incident report logged yet.
        </div>
      )}
    </div>
  );
}
