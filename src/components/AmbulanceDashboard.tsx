import { useEffect, useState } from "react";
import { emergencyService, type Ambulance, type Incident } from "@/lib/emergencyService";
import { Ambulance as AmbulanceIcon, Clock, MapPin, Activity, RefreshCw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AmbulanceDashboardProps {
  incidents: Incident[];
  onRefresh: () => void | Promise<void>;
}

export function AmbulanceDashboard({ incidents, onRefresh }: AmbulanceDashboardProps) {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAmbulances();
  }, []);

  const loadAmbulances = async () => {
    setLoading(true);
    try {
      const data = await emergencyService.getAmbulances();
      setAmbulances(data || []);
    } catch (error) {
      console.error("Failed to load ambulances:", error);
      setAmbulances([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      READY: "bg-emerald-500/20 text-emerald-400",
      ASSIGNED: "bg-blue-500/20 text-blue-400",
      EN_ROUTE: "bg-yellow-500/20 text-yellow-400",
      AT_SCENE: "bg-orange-500/20 text-orange-400",
      TRANSPORTING: "bg-red-500/20 text-red-400",
      ARRIVED: "bg-purple-500/20 text-purple-400",
      COMPLETED: "bg-slate-500/20 text-slate-400",
    };
    return colors[status] || colors.READY;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0d1524] border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">AMBULANCE DISPATCH</h2>
            <p className="text-sm text-slate-400 mt-1">Real-time ambulance fleet status and dispatch coordination</p>
          </div>
          <button
            onClick={loadAmbulances}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <AmbulanceIcon className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Total Units</span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">{ambulances.length}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Ready</span>
            </div>
            <p className="text-2xl font-bold text-emerald-400 mt-2">
              {ambulances.filter(a => a.status === "READY").length}
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Activity className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">En Route</span>
            </div>
            <p className="text-2xl font-bold text-yellow-400 mt-2">
              {ambulances.filter(a => a.status === "EN_ROUTE" || a.status === "TRANSPORTING").length}
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Assigned</span>
            </div>
            <p className="text-2xl font-bold text-blue-400 mt-2">
              {ambulances.filter(a => a.status === "ASSIGNED").length}
            </p>
          </div>
        </div>
      </div>

      {/* Ambulance Fleet */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {ambulances.map((ambulance) => (
          <div key={ambulance.ambulanceId} className="bg-[#0d1524] border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white font-mono">{ambulance.ambulanceId}</h3>
                  <p className="text-sm text-slate-400 mt-1">Crew: {ambulance.crewId}</p>
                </div>
                <span className={cn("px-2 py-1 rounded text-xs font-bold", getStatusColor(ambulance.status))}>
                  {ambulance.status?.replace("_", " ") || "UNKNOWN"}
                </span>
              </div>

              {/* Crew Members */}
              <div className="mt-4">
                <p className="text-xs text-slate-400 mb-2">Crew Members</p>
                <div className="flex flex-wrap gap-2">
                  {(ambulance.crewMembers || []).map((member, idx) => (
                    <span key={idx} className="px-2 py-1 rounded bg-slate-800 text-xs text-slate-300 border border-slate-700">
                      {member}
                    </span>
                  ))}
                </div>
              </div>

              {/* Location & ETA */}
              <div className="mt-4 space-y-2">
                {typeof ambulance.currentLocation === "object" && ambulance.currentLocation && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-300">
                      {ambulance.currentLocation.lat.toFixed(4)}, {ambulance.currentLocation.lng.toFixed(4)}
                    </span>
                  </div>
                )}
                {ambulance.etaMinutes && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="text-slate-300">ETA: {ambulance.etaMinutes} min</span>
                  </div>
                )}
              </div>

              {/* Assignment Info */}
              {ambulance.assignedIncidentId && (
                <div className="mt-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                  <p className="text-xs text-slate-400">Assigned to</p>
                  <p className="text-sm font-bold text-white font-mono mt-1">{ambulance.assignedIncidentId}</p>
                  {ambulance.dispatchTime && (
                    <p className="text-xs text-slate-400 mt-1">
                      Dispatched: {new Date(ambulance.dispatchTime).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Active Transport */}
      {incidents?.length > 0 && (
        <div className="bg-[#0d1524] border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white">ACTIVE TRANSPORTS</h3>
          </div>
          <div className="divide-y divide-slate-800">
            {incidents
              .map((incident) => {
                const assignedAmbulance = incident.ambulance;
                if (!assignedAmbulance) return null;

                return (
                  <div key={incident.incidentId} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white font-mono">{incident.incidentId}</p>
                      <p className="text-xs text-slate-400 mt-1">{incident.location?.address}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white font-mono">{assignedAmbulance.ambulanceId}</p>
                      <p className="text-xs text-slate-400 mt-1">ETA: {assignedAmbulance.etaMinutes} min</p>
                      <span className={cn("px-2 py-1 rounded text-xs font-bold mt-1 inline-block", getStatusColor(assignedAmbulance.status))}>
                        {assignedAmbulance.status?.replace("_", " ") || "UNKNOWN"}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}