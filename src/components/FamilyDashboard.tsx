import { HeartHandshake, MapPin, PhoneCall, Clock3, CheckCircle2, AlertCircle, RefreshCw, Building2, Ambulance, Shield, MessageSquare, Activity } from "lucide-react";
import type { Incident } from "@/lib/emergencyService";

interface FamilyDashboardProps {
  incidents: Incident[];
  onRefresh: () => void | Promise<void>;
}

export function FamilyDashboard({ incidents, onRefresh }: FamilyDashboardProps) {
  const familyIncidents = incidents.filter((incident) => incident.familyNotification?.status);
  const acknowledgedCount = familyIncidents.filter((incident) => incident.familyNotification.status.includes("ACK")).length;
  const activeAmbulances = familyIncidents.filter((incident) => incident.ambulance).length;
  const acceptedHospitals = familyIncidents.filter((incident) => incident.hospital?.acceptanceStatus === "ACCEPTED").length;

  const getNotificationTone = (status: string) => {
    if (status.includes("SENT") || status.includes("ACKNOWLEDGED")) {
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    }
    if (status.includes("PENDING")) {
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
    }
    return "bg-slate-600/20 text-slate-300 border-slate-600/30";
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#0d1524] border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <HeartHandshake className="h-5 w-5 text-pink-400" />
              <h2 className="text-2xl font-bold text-white tracking-tight">FAMILY NOTIFICATION</h2>
            </div>
            <p className="text-sm text-slate-400 mt-1">Status updates and contact notifications for families affected by incidents</p>
          </div>
          <button
            onClick={onRefresh}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors"
            aria-label="Refresh family notifications"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <PhoneCall className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">Notified</span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">
              {familyIncidents.filter((incident) => incident.familyNotification.status.includes("SENT")).length}
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Clock3 className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">Pending</span>
            </div>
            <p className="text-2xl font-bold text-yellow-400 mt-2">
              {familyIncidents.filter((incident) => incident.familyNotification.status.includes("PENDING")).length}
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">Acknowledged</span>
            </div>
            <p className="text-2xl font-bold text-emerald-400 mt-2">
              {familyIncidents.filter((incident) => incident.familyNotification.status.includes("ACK")).length}
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xs uppercase tracking-wider">Open Cases</span>
            </div>
            <p className="text-2xl font-bold text-red-400 mt-2">{familyIncidents.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#0d1524] border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">FAMILY CARE DESK</p>
            <p className="text-xs text-slate-500 mt-1">Chennai emergency liaison network · updates are synchronized with command</p>
          </div>
          <span className="flex items-center gap-2 text-xs text-emerald-400"><Activity className="h-4 w-4" />Live updates</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-800">
          {[
            { label: "Open Cases", value: familyIncidents.length, icon: AlertCircle, tone: "text-red-400" },
            { label: "Acknowledged", value: acknowledgedCount, icon: CheckCircle2, tone: "text-emerald-400" },
            { label: "Hospital Accepted", value: acceptedHospitals, icon: Building2, tone: "text-cyan-400" },
            { label: "Ambulance Tracking", value: activeAmbulances, icon: Ambulance, tone: "text-yellow-400" },
          ].map((metric) => (
            <div key={metric.label} className="p-4">
              <metric.icon className={`h-4 w-4 ${metric.tone}`} />
              <p className="text-xl font-bold text-white mt-2">{metric.value}</p>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {familyIncidents.length > 0 ? (
          familyIncidents.map((incident) => (
            <div key={incident.incidentId} className="bg-[#0d1524] border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-white font-mono">{incident.incidentId}</p>
                  <p className="text-xs text-slate-400">{incident.severity} incident</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold border ${getNotificationTone(incident.familyNotification.status)}`}>
                  {incident.familyNotification.status}
                </span>
              </div>

              <div className="p-4 space-y-4">
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="h-4 w-4 text-red-400" />
                  <span className="text-sm">{incident.location.address}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                    <p className="text-xs text-slate-400">Method</p>
                    <p className="text-white font-medium mt-1">{incident.familyNotification.method}</p>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                    <p className="text-xs text-slate-400">Last Update</p>
                    <p className="text-white font-medium mt-1">
                      {incident.familyNotification.timestamp ? new Date(incident.familyNotification.timestamp).toLocaleTimeString() : "Not sent"}
                    </p>
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-2">Active Incident Summary</p>
                  <p className="text-sm text-slate-200">{incident.description || "Emergency response in progress."}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3">
                    <Building2 className="h-4 w-4 text-emerald-400" />
                    <p className="mt-2 text-[10px] uppercase tracking-wider text-slate-400">Hospital</p>
                    <p className="mt-1 truncate text-xs font-semibold text-white">{incident.hospital?.hospitalName || "Selecting best hospital"}</p>
                    <p className="mt-1 text-[10px] text-emerald-300">{incident.hospital?.acceptanceStatus || "In evaluation"}</p>
                  </div>
                  <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3">
                    <Ambulance className="h-4 w-4 text-yellow-400" />
                    <p className="mt-2 text-[10px] uppercase tracking-wider text-slate-400">Ambulance ETA</p>
                    <p className="mt-1 text-xs font-semibold text-white">{incident.ambulance ? `${incident.ambulance.etaMinutes} minutes` : "Awaiting dispatch"}</p>
                    <p className="mt-1 text-[10px] text-yellow-300">{incident.ambulance?.status || "Not assigned"}</p>
                  </div>
                  <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
                    <Shield className="h-4 w-4 text-blue-400" />
                    <p className="mt-2 text-[10px] uppercase tracking-wider text-slate-400">Police Escort</p>
                    <p className="mt-1 text-xs font-semibold text-white">{incident.police.length > 0 ? `${incident.police.length} unit(s)` : "Assigning nearest unit"}</p>
                    <p className="mt-1 text-[10px] text-blue-300">Route protected</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-pink-500/20 bg-pink-500/10 p-3">
                  <MessageSquare className="h-4 w-4 shrink-0 text-pink-400" />
                  <div>
                    <p className="text-xs font-semibold text-pink-200">Latest family communication</p>
                    <p className="mt-1 text-xs text-slate-300">{incident.familyNotification.status} via {incident.familyNotification.method} · Command center synchronized</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-pink-500/10 border border-pink-500/20">
                  <div>
                    <p className="text-xs text-pink-300 uppercase tracking-wider">Contact Channel</p>
                    <p className="text-sm text-white mt-1">Family liaison / SMS / call center</p>
                  </div>
                  <PhoneCall className="h-5 w-5 text-pink-400" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-[#0d1524] border border-slate-800 rounded-xl p-10 text-center">
            <HeartHandshake className="h-10 w-10 text-slate-500 mx-auto" />
            <p className="mt-4 text-lg font-semibold text-white">No family notifications active</p>
            <p className="text-sm text-slate-400 mt-2">Family updates will appear here once an incident is created and routed.</p>
          </div>
        )}
      </div>
    </div>
  );
}
