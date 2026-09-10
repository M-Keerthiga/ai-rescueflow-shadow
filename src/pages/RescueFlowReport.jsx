import React from 'react';
import { FileText } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import IncidentReportView from '../components/rescue/IncidentReportView.jsx';
import PreventionInsightCard from '../components/rescue/PreventionInsightCard.jsx';

export default function RescueFlowReport() {
  const { activeIncident, incidentsList } = useApp();

  return (
    <div className="space-y-6">
      <div className="bg-navy-900 border border-slate-800 p-5 rounded-2xl shadow-md">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl font-bold text-slate-100 font-mono tracking-tight">
            REPORTED INCIDENTS HISTORY
          </h1>
        </div>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Historical incident records, blackbox reports, dispatch outcomes, and RescueFlow completion state.
        </p>
      </div>

      {incidentsList.length > 0 ? (
        <div className="space-y-6">
          {incidentsList.map((incident) => (
            <section key={incident.id} className="space-y-4">
              <div className="bg-navy-900 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300">
                <span className="text-cyan-400 font-bold">{incident.id}</span>{' '}
                <span>{incident.timestamp}</span>{' '}
                <span className="text-amber-400">{incident.severityLevel}</span>
              </div>
              <IncidentReportView incident={incident} />
              <PreventionInsightCard insights={incident.preventionInsights} />
            </section>
          ))}
        </div>
      ) : activeIncident ? (
        <div className="space-y-6"><IncidentReportView incident={activeIncident} /><PreventionInsightCard insights={activeIncident.preventionInsights} /></div>
      ) : (
        <div className="bg-navy-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 font-mono text-xs">
          No incident report logged yet.
        </div>
      )}
    </div>
  );
}
