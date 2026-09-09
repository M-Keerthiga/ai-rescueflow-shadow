import { type Incident } from "@/lib/emergencyService";
import { Radio, MapPin, AlertTriangle, Building2, Ambulance, Shield, Users, Clock, RefreshCw, Activity, FileText, CheckCircle2, Wifi, Navigation } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommandCenterProps {
  incidents: Incident[];
  loading: boolean;
  onIncidentSelect: (incident: Incident) => void;
  onRefresh: () => void | Promise<void>;
}

export function CommandCenter({ incidents, loading, onIncidentSelect, onRefresh }: CommandCenterProps) {
  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      LOW: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      MODERATE: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      HIGH: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      CRITICAL: "bg-red-500/20 text-red-400 border-red-500/30",
      CATASTROPHIC: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    };
    return colors[severity] || colors.MODERATE;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "COORDINATION IN PROGRESS": "bg-yellow-500/20 text-yellow-400",
      "COORDINATION COMPLETED": "bg-emerald-500/20 text-emerald-400",
      "RESPONSE IN PROGRESS": "bg-blue-500/20 text-blue-400",
      "RESPONSE COMPLETED": "bg-emerald-500/20 text-emerald-400",
    };
    return colors[status] || "bg-slate-500/20 text-slate-400";
  };

  const responseMetrics = {
    detected: incidents.length,
    hospitals: incidents.filter((incident) => incident.hospital?.acceptanceStatus === "ACCEPTED").length,
    ambulances: incidents.filter((incident) => incident.ambulance?.status).length,
    police: incidents.filter((incident) => incident.police.length > 0).length,
    notified: incidents.filter((incident) => incident.familyNotification?.status.includes("SENT")).length,
  };

  const activeEta = incidents
    .map((incident) => incident.ambulance?.etaMinutes)
    .filter((eta): eta is number => typeof eta === "number");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0d1524] border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">EMERGENCY COMMAND CENTER</h2>
            <p className="text-sm text-slate-400 mt-1">Real-time incident monitoring and emergency response coordination</p>
          </div>
          <button
            onClick={onRefresh}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Activity className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Active Incidents</span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">{incidents.length}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Critical</span>
            </div>
            <p className="text-2xl font-bold text-red-400 mt-2">
              {incidents.filter(i => i.severity === "CRITICAL" || i.severity === "CATASTROPHIC").length}
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Building2 className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Hospitals</span>
            </div>
            <p className="text-2xl font-bold text-emerald-400 mt-2">
              {incidents.filter(i => i.hospital?.acceptanceStatus === "ACCEPTED").length}
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Ambulance className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Ambulances</span>
            </div>
            <p className="text-2xl font-bold text-yellow-400 mt-2">
              {incidents.filter(i => i.ambulance).length}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#0d1524] border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">RESPONSE OPERATIONS PIPELINE</p>
            <p className="text-xs text-slate-500 mt-1">Chennai emergency network · live workflow state</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <Wifi className="h-4 w-4" />
            Network synced
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-slate-800">
          {[
            { label: "Detected", value: responseMetrics.detected, icon: Activity, tone: "text-red-400" },
            { label: "Hospitals", value: responseMetrics.hospitals, icon: Building2, tone: "text-emerald-400" },
            { label: "Ambulances", value: responseMetrics.ambulances, icon: Ambulance, tone: "text-yellow-400" },
            { label: "Police Escort", value: responseMetrics.police, icon: Shield, tone: "text-blue-400" },
            { label: "Family Notified", value: responseMetrics.notified, icon: CheckCircle2, tone: "text-pink-400" },
          ].map((metric) => (
            <div key={metric.label} className="p-4">
              <metric.icon className={cn("h-4 w-4", metric.tone)} />
              <p className="text-xl font-bold text-white mt-2">{metric.value}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">{metric.label}</p>
            </div>
          ))}
        </div>
        <div className="px-5 py-3 border-t border-slate-800 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400">
          <span className="flex items-center gap-2"><Navigation className="h-3.5 w-3.5 text-cyan-400" />Chennai city command grid online</span>
          <span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-yellow-400" />Nearest ambulance ETA: {activeEta.length > 0 ? `${Math.min(...activeEta)} min` : "Awaiting dispatch"}</span>
          <span className="flex items-center gap-2"><Radio className="h-3.5 w-3.5 text-emerald-400" />AI detection and citizen reports connected</span>
        </div>
      </div>

      {/* Incident Cards */}
      {loading ? (
        <div className="bg-[#0d1524] border border-slate-800 rounded-xl p-12 text-center">
          <p className="text-slate-400">Loading incidents...</p>
        </div>
      ) : incidents.length === 0 ? (
        <div className="bg-[#0d1524] border border-slate-800 rounded-xl p-12 text-center">
          <Radio className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">NO ACTIVE INCIDENTS</h3>
          <p className="text-slate-400">The system is monitoring for potential incidents.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {incidents.map((incident) => (
            <div key={incident.incidentId} className="bg-[#0d1524] border border-slate-800 rounded-xl overflow-hidden">
              {/* Incident Header */}
              <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-white font-mono">{incident.incidentId}</span>
                  <span className={cn("px-2 py-1 rounded text-xs font-bold border", getSeverityColor(incident.severity))}>
                    {incident.severity}
                  </span>
                </div>
                <span className="text-xs text-slate-400">Confidence: {incident.confidence}%</span>
              </div>

              <div className="p-4 space-y-4">
                {/* Location */}
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-slate-300">{incident.location.address}</p>
                    <p className="text-xs text-slate-500 font-mono">
                      {incident.location.lat.toFixed(4)}, {incident.location.lng.toFixed(4)}
                    </p>
                  </div>
                </div>

                {/* Sources */}
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Sources</p>
                  <div className="flex flex-wrap gap-2">
                    {incident.sources.map((source, idx) => (
                      <span key={idx} className="px-2 py-1 rounded bg-slate-800 text-xs text-slate-300 border border-slate-700">
                        {source}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Response Details */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Hospital */}
                  {incident.hospital && (
                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="h-4 w-4 text-emerald-400" />
                        <span className="text-xs text-slate-400">Hospital</span>
                      </div>
                      <p className="text-sm font-semibold text-white">{incident.hospital.hospitalName}</p>
                      <p className="text-xs text-slate-400 mt-1">Trauma: L{incident.hospital.traumaLevel}</p>
                      <p className="text-xs text-slate-400">Beds: {incident.hospital.availableBeds} | ICU: {incident.hospital.availableICUBeds}</p>
                      <span className="text-xs text-emerald-400 font-bold mt-1 inline-block">
                        {incident.hospital.acceptanceStatus}
                      </span>
                    </div>
                  )}

                  {/* Ambulance */}
                  {incident.ambulance && (
                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Ambulance className="h-4 w-4 text-red-400" />
                        <span className="text-xs text-slate-400">Ambulance</span>
                      </div>
                      <p className="text-sm font-semibold text-white font-mono">{incident.ambulance.ambulanceId}</p>
                      <p className="text-xs text-slate-400 mt-1">ETA: {incident.ambulance.etaMinutes} min</p>
                      <span className="text-xs text-yellow-400 font-bold mt-1 inline-block">
                        {incident.ambulance.status}
                      </span>
                    </div>
                  )}

                  {/* Police */}
                  {incident.police.length > 0 && (
                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="h-4 w-4 text-blue-400" />
                        <span className="text-xs text-slate-400">Police Units</span>
                      </div>
                      <div className="space-y-1">
                        {incident.police.map((unit, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="text-xs text-slate-300 font-mono">{unit.unitId}</span>
                            <span className="text-xs text-slate-400">ETA: {unit.eta ?? unit.etaMinutes ?? 0} min</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Family Notification */}
                  {incident.familyNotification && (
                    <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-purple-400" />
                        <span className="text-xs text-slate-400">Family</span>
                      </div>
                      <span className="text-xs text-emerald-400 font-bold">
                        {incident.familyNotification.status}
                      </span>
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700">
                  <span className="text-xs text-slate-400">Coordination Status</span>
                  <span className={cn("text-xs font-bold", getStatusColor(incident.coordinationStatus))}>
                    {incident.coordinationStatus}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onIncidentSelect(incident)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    View Report
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}