import { useEffect, useState } from "react";
import { emergencyService, type Hospital, type Incident } from "@/lib/emergencyService";
import { Building2, Bed, HeartPulse, Ambulance, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface HospitalDashboardProps {
  incidents: Incident[];
  onRefresh: () => void | Promise<void>;
}

export function HospitalDashboard({ incidents, onRefresh }: HospitalDashboardProps) {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHospitals();
  }, []);

  const loadHospitals = async () => {
    setLoading(true);
    try {
      const data = await emergencyService.getHospitals();
      setHospitals(data);
    } catch (error) {
      console.error("Failed to load hospitals:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCapacityColor = (load: number) => {
    if (load < 50) return "bg-emerald-500/20 text-emerald-400";
    if (load < 75) return "bg-yellow-500/20 text-yellow-400";
    return "bg-red-500/20 text-red-400";
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      AVAILABLE: "bg-emerald-500/20 text-emerald-400",
      EVALUATING: "bg-yellow-500/20 text-yellow-400",
      ACCEPTED: "bg-blue-500/20 text-blue-400",
      FULL: "bg-red-500/20 text-red-400",
    };
    return colors[status] || colors.AVAILABLE;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0d1524] border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">HOSPITAL COORDINATION</h2>
            <p className="text-sm text-slate-400 mt-1">Real-time hospital capacity and emergency response status</p>
          </div>
          <button
            onClick={loadHospitals}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Building2 className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Total Hospitals</span>
            </div>
            <p className="text-2xl font-bold text-white mt-2">{hospitals.length}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Bed className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Available Beds</span>
            </div>
            <p className="text-2xl font-bold text-emerald-400 mt-2">
              {hospitals.reduce((sum, h) => sum + h.availableBeds, 0)}
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <HeartPulse className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">ICU Beds</span>
            </div>
            <p className="text-2xl font-bold text-red-400 mt-2">
              {hospitals.reduce((sum, h) => sum + h.availableICUBeds, 0)}
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Ambulance className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">Ambulances</span>
            </div>
            <p className="text-2xl font-bold text-yellow-400 mt-2">
              {hospitals.reduce((sum, h) => sum + h.ambulancesAvailable, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Hospital Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {hospitals.map((hospital) => (
          <div key={hospital.hospitalId} className="bg-[#0d1524] border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">{hospital.hospitalName}</h3>
                  <p className="text-sm text-slate-400 mt-1">Trauma Level: {hospital.traumaLevel}</p>
                </div>
                <span className={cn("px-2 py-1 rounded text-xs font-bold", getStatusColor(hospital.acceptanceStatus))}>
                  {hospital.acceptanceStatus}
                </span>
              </div>

              {/* Capacity Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">Current Load</span>
                  <span className={cn("text-xs font-bold", getCapacityColor(hospital.currentLoad))}>
                    {hospital.currentLoad}%
                  </span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      hospital.currentLoad < 50 ? "bg-emerald-500" : hospital.currentLoad < 75 ? "bg-yellow-500" : "bg-red-500"
                    )}
                    style={{ width: `${hospital.currentLoad}%` }}
                  />
                </div>
              </div>

              {/* Resources */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                  <p className="text-xs text-slate-400">Beds</p>
                  <p className="text-lg font-bold text-white mt-1">{hospital.availableBeds}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                  <p className="text-xs text-slate-400">ICU</p>
                  <p className="text-lg font-bold text-white mt-1">{hospital.availableICUBeds}</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                  <p className="text-xs text-slate-400">Ambulances</p>
                  <p className="text-lg font-bold text-white mt-1">{hospital.ambulancesAvailable}</p>
                </div>
              </div>

              {/* Status */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Capacity Status</span>
                  <span className="text-slate-300">{hospital.capacityStatus}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Coordination Score</span>
                  <span className="text-slate-300">{hospital.coordinationScore?.toFixed(2) || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Incidents */}
      {incidents.length > 0 && (
        <div className="bg-[#0d1524] border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white">ACTIVE INCIDENTS</h3>
          </div>
          <div className="divide-y divide-slate-800">
            {incidents.map((incident) => (
              <div key={incident.incidentId} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white font-mono">{incident.incidentId}</p>
                  <p className="text-xs text-slate-400 mt-1">{incident.location.address}</p>
                </div>
                <div className="text-right">
                  <span className={cn(
                    "px-2 py-1 rounded text-xs font-bold",
                    incident.severity === "CRITICAL" || incident.severity === "CATASTROPHIC"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  )}>
                    {incident.severity}
                  </span>
                  {incident.hospital && (
                    <p className="text-xs text-slate-400 mt-1">
                      {incident.hospital.hospitalName} - {incident.hospital.acceptanceStatus}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}