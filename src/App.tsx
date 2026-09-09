import { useState, useEffect } from "react";
import { CommandCenter } from "@/components/CommandCenter";
import { PoliceControlRoom } from "@/components/PoliceControlRoom";
import { PoliceDashboard } from "@/components/PoliceDashboard";
import { HospitalDashboard } from "@/components/HospitalDashboard";
import { AmbulanceDashboard } from "@/components/AmbulanceDashboard";
import { IncidentResponse } from "@/components/IncidentResponse";
import { IncidentReport } from "@/components/IncidentReport";
import { FamilyDashboard } from "@/components/FamilyDashboard";
import { SystemConfiguration } from "@/components/SystemConfiguration";
import { emergencyService, type Incident } from "@/lib/emergencyService";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Shield,
  Building2,
  Ambulance,
  AlertTriangle,
  FileText,
  Settings,
  Radio,
  Activity,
  HeartHandshake,
} from "lucide-react";

type View = "command" | "police-dashboard" | "hospital-dashboard" | "ambulance" | "response" | "report" | "family" | "settings";

const navItems = [
  { id: "command" as View, label: "Command Center", icon: LayoutDashboard },
  { id: "police-dashboard" as View, label: "Police Dashboard", icon: Shield },
  { id: "hospital-dashboard" as View, label: "Hospital Dashboard", icon: Building2 },
  { id: "ambulance" as View, label: "Ambulance", icon: Ambulance },
  { id: "response" as View, label: "Incident Response", icon: AlertTriangle },
  { id: "report" as View, label: "Incident Report", icon: FileText },
  { id: "family" as View, label: "Family Dashboard", icon: HeartHandshake },
  { id: "settings" as View, label: "Configuration", icon: Settings },
];

export default function App() {
  const [activeView, setActiveView] = useState<View>("command");
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [systemStatus, setSystemStatus] = useState("ONLINE");

  const loadIncidents = async () => {
    try {
      const data = await emergencyService.getAllIncidents();
      setIncidents(data || []);
    } catch (error) {
      console.error("Failed to load incidents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
    const interval = setInterval(loadIncidents, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const path = window.location.pathname.replace('/', '');
    if (path === 'police-dashboard' || path === 'hospital-dashboard' || path === 'ambulance' || path === 'response' || path === 'report' || path === 'family' || path === 'settings') {
      setActiveView(path as View);
    } else {
      setActiveView('command');
      window.history.replaceState({}, '', '/');
    }
  }, []);

  const navigateTo = (view: View) => {
    setActiveView(view);
    const route = view === 'command' ? '/' : `/${view}`;
    window.history.pushState({}, '', route);
  };

  const handleIncidentSelect = (incident: Incident) => {
    setSelectedIncident(incident);
    setActiveView("report");
    window.history.pushState({}, '', '/report');
  };

  const handleIncidentCreated = () => {
    loadIncidents();
  };

  const renderView = () => {
    switch (activeView) {
      case "command":
        return (
          <CommandCenter
            incidents={incidents}
            loading={loading}
            onIncidentSelect={handleIncidentSelect}
            onRefresh={loadIncidents}
          />
        );
      case "police-dashboard":
        return <PoliceDashboard incidents={incidents} onRefresh={loadIncidents} />;
      case "hospital-dashboard":
        return <HospitalDashboard incidents={incidents} onRefresh={loadIncidents} />;
      case "ambulance":
        return <AmbulanceDashboard incidents={incidents} onRefresh={loadIncidents} />;
      case "response":
        return <IncidentResponse onIncidentCreated={handleIncidentCreated} />;
      case "report":
        return <IncidentReport onIncidentCreated={handleIncidentCreated} />;
      case "family":
        return <FamilyDashboard incidents={incidents} onRefresh={loadIncidents} />;
      case "settings":
        return <SystemConfiguration />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white flex">
      <aside className="w-64 bg-[#0d1524] border-r border-slate-800 flex flex-col fixed h-screen overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-red-600 flex items-center justify-center">
              <Radio className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">RESCUEFLOW</h1>
              <p className="text-xs text-slate-400">AI Emergency Response</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto no-scrollbar">
          <div className="px-4 mb-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Main Menu</p>
          </div>
          <div className="space-y-1 px-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigateTo(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-red-600/10 text-red-400 border border-red-600/20"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-red-500" />}
                </button>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-medium text-slate-300">System</span>
            </div>
            <span className="text-xs font-bold text-emerald-400">{systemStatus}</span>
          </div>
          <div className="mt-2 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <span className="text-xs font-bold text-yellow-400">SIMULATION ACTIVE</span>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">{renderView()}</div>
      </main>
    </div>
  );
}