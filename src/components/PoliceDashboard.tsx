import { useEffect, useState } from "react";

import {
  emergencyService,
  type Ambulance,
  type Hospital,
  type Incident,
  type PoliceUnit,
} from "@/lib/emergencyService";

import {
  MapPin,
  Video,
  Radio,
  Shield,
  AlertTriangle,
  Clock,
  Activity,
  Camera,
  Users,
  Building2,
  Ambulance as AmbulanceIcon,
  RefreshCw,
} from "lucide-react";

import { cn } from "@/lib/utils";

// ============================================================
// LOCAL CAMERA VIDEOS
// ============================================================

import camera1 from "@/assets/cameras/camera 1.mp4";
import camera2 from "@/assets/cameras/camera 2.mp4";
import camera3 from "@/assets/cameras/camera 3.mp4";
import camera4 from "@/assets/cameras/camera 4.mp4";

// ============================================================
// TYPES
// ============================================================

interface PoliceDashboardProps {
  incidents: Incident[];
  onRefresh: () => void | Promise<void>;
}

// ============================================================
// COMPONENT
// ============================================================

export function PoliceDashboard({
  incidents,
  onRefresh,
}: PoliceDashboardProps) {
  const [selectedIncident, setSelectedIncident] =
    useState<Incident | null>(null);

  const [policeUnits, setPoliceUnits] = useState<PoliceUnit[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);

  const [loading, setLoading] = useState(true);

  const [cameraTime, setCameraTime] = useState(new Date());

  // ============================================================
  // LOAD DATA
  // ============================================================

  useEffect(() => {
    loadData();
  }, [incidents]);

  // ============================================================
  // CAMERA CLOCK
  // ============================================================

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCameraTime(new Date());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  // ============================================================
  // LOAD POLICE / HOSPITAL / AMBULANCE DATA
  // ============================================================

  const loadData = async () => {
    setLoading(true);

    try {
      const [units, hosp, amb] = await Promise.all([
        emergencyService.getPoliceUnits(),
        emergencyService.getHospitals(),
        emergencyService.getAmbulances(),
      ]);

      setPoliceUnits(units || []);
      setHospitals(hosp || []);
      setAmbulances(amb || []);

      // Select the most critical active incident
      if (incidents.length > 0) {
        const critical = incidents.find(
          (inc) =>
            inc.severity === "CRITICAL" ||
            inc.severity === "CATASTROPHIC"
        );

        setSelectedIncident(critical || incidents[0]);
      } else {
        setSelectedIncident(null);
      }
    } catch (error) {
      console.error("Failed to load police data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // SEVERITY COLORS
  // ============================================================

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      LOW: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      MODERATE:
        "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      HIGH: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      CRITICAL:
        "bg-red-500/20 text-red-400 border-red-500/30",
      CATASTROPHIC:
        "bg-purple-500/20 text-purple-400 border-purple-500/30",
    };

    return colors[severity] || colors.MODERATE;
  };

  // ============================================================
  // UNIT STATUS COLORS
  // ============================================================

  const getUnitStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      AVAILABLE:
        "bg-emerald-500/20 text-emerald-400",

      ASSIGNED:
        "bg-blue-500/20 text-blue-400",

      EN_ROUTE:
        "bg-yellow-500/20 text-yellow-400",

      AT_SCENE:
        "bg-orange-500/20 text-orange-400",

      COMPLETED:
        "bg-slate-500/20 text-slate-400",
    };

    return colors[status] || colors.AVAILABLE;
  };

  // ============================================================
  // REAL LOCAL CAMERA FEEDS
  // ============================================================

  const cameraFeeds = [
    {
      id: "TN-04",
      name: "Kathipara Flyover",
      area: "Chennai South",
      location: "GST Road / Inner Ring Road",
      status: "LIVE",
      signal: "94%",
      video: camera1,
      color:
        "bg-red-500/20 text-red-400 border-red-500/30",
    },

    {
      id: "TN-12",
      name: "Anna Salai Junction",
      area: "Chennai Central",
      location: "Saidapet / Guindy",
      status: "LIVE",
      signal: "91%",
      video: camera2,
      color:
        "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    },

    {
      id: "TN-21",
      name: "OMR Tech Corridor",
      area: "Chennai East",
      location: "Taramani / Sholinganallur",
      status: "LIVE",
      signal: "88%",
      video: camera3,
      color:
        "bg-blue-500/20 text-blue-400 border-blue-500/30",
    },

    {
      id: "TN-31",
      name: "ECR Coastal Road",
      area: "Chennai South",
      location: "Adyar / Thiruvanmiyur",
      status: "LIVE",
      signal: "77%",
      video: camera4,
      color:
        "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    },
  ];

  // ============================================================
  // CHENNAI MAP LABELS
  // ============================================================

  const chennaiMapLabels = [
    {
      name: "Anna Salai",
      top: "48%",
      left: "43%",
      rotate: "-18deg",
    },

    {
      name: "OMR",
      top: "70%",
      left: "68%",
      rotate: "-35deg",
    },

    {
      name: "ECR",
      top: "82%",
      left: "76%",
      rotate: "-58deg",
    },

    {
      name: "GST Road",
      top: "28%",
      left: "18%",
      rotate: "72deg",
    },

    {
      name: "Inner Ring Road",
      top: "36%",
      left: "57%",
      rotate: "18deg",
    },
  ];

  // ============================================================
  // CAMERA TIMESTAMP
  // ============================================================

  const liveCameraTimestamp = cameraTime
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
    .replace(",", "");

  // ============================================================
  // RETURN
  // ============================================================

  return (
    <div className="space-y-6">

      {/* ========================================================
          CONTROL ROOM HEADER
      ======================================================== */}

      <div className="bg-[#0d1524] border border-slate-800 rounded-xl p-6">

        <div className="flex items-center justify-between">

          <div>

            <div className="flex items-center gap-3">

              <span className="text-[10px] font-mono tracking-[0.3em] text-red-400">
                OPS // 04
              </span>

              <span className="h-px w-10 bg-red-500/60" />

              <span className="text-[10px] font-mono text-slate-500">
                SECURE NETWORK
              </span>

            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight mt-2">
              POLICE EMERGENCY CONTROL ROOM
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Real-time incident monitoring and response coordination
            </p>

          </div>

          <div className="flex items-center gap-3">

            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30">

              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />

              <span className="text-sm text-emerald-400 font-medium">
                SYSTEM ACTIVE
              </span>

            </div>

            <button
              onClick={onRefresh}
              className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
            </button>

          </div>

        </div>

        {/* Priority Channel */}

        <div className="mt-5 flex items-center gap-3 overflow-hidden border-y border-slate-800 py-2 text-[10px] font-mono uppercase tracking-wider">

          <span className="shrink-0 text-red-400">
            Priority channel
          </span>

          <span className="h-1 w-1 shrink-0 rounded-full bg-red-500 animate-pulse" />

          <span className="truncate text-slate-500">
            {selectedIncident
              ? `${selectedIncident.incidentId} / ${selectedIncident.location.address} / response coordination active`
              : "No priority incident assigned / monitoring all sectors"}
          </span>

          <span className="ml-auto shrink-0 text-emerald-400">
            Encrypted uplink
          </span>

        </div>

        {/* ======================================================
            STATUS BAR
        ====================================================== */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

          {/* Active Incidents */}

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">

            <div className="flex items-center gap-2 text-slate-400">

              <Activity className="h-4 w-4" />

              <span className="text-xs font-medium uppercase tracking-wider">
                Active Incidents
              </span>

            </div>

            <p className="text-2xl font-bold text-white mt-2">
              {incidents.length}
            </p>

          </div>

          {/* Available Units */}

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">

            <div className="flex items-center gap-2 text-slate-400">

              <Shield className="h-4 w-4" />

              <span className="text-xs font-medium uppercase tracking-wider">
                Units Available
              </span>

            </div>

            <p className="text-2xl font-bold text-emerald-400 mt-2">
              {
                policeUnits.filter(
                  (u) => u.status === "AVAILABLE"
                ).length
              }
            </p>

          </div>

          {/* Deployed Units */}

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">

            <div className="flex items-center gap-2 text-slate-400">

              <Users className="h-4 w-4" />

              <span className="text-xs font-medium uppercase tracking-wider">
                Units Deployed
              </span>

            </div>

            <p className="text-2xl font-bold text-yellow-400 mt-2">
              {
                policeUnits.filter(
                  (u) => u.status !== "AVAILABLE"
                ).length
              }
            </p>

          </div>

          {/* Critical */}

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">

            <div className="flex items-center gap-2 text-slate-400">

              <AlertTriangle className="h-4 w-4" />

              <span className="text-xs font-medium uppercase tracking-wider">
                Critical
              </span>

            </div>

            <p className="text-2xl font-bold text-red-400 mt-2">
              {
                incidents.filter(
                  (i) =>
                    i.severity === "CRITICAL" ||
                    i.severity === "CATASTROPHIC"
                ).length
              }
            </p>

          </div>

        </div>

      </div>

      {/* ========================================================
          MAIN GRID
      ======================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ======================================================
            LEFT COLUMN
        ====================================================== */}

        <div className="xl:col-span-2 space-y-6">

          {/* ====================================================
              LIVE CAMERA GRID
          ==================================================== */}

          <div className="bg-[#0d1524] border border-slate-800 rounded-xl p-4">

            <div className="flex items-center justify-between mb-4">

              <div className="flex items-center gap-2">

                <Video className="h-4 w-4 text-red-400" />

                <span className="text-sm font-semibold text-white">
                  LIVE CAMERA GRID
                </span>

              </div>

              <span className="text-xs text-slate-400">
                Chennai traffic network / 4 live streams
              </span>

            </div>

            {/* ==================================================
                CAMERA GRID
            ================================================== */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {cameraFeeds.map((camera) => (

                <div
                  key={camera.id}
                  className="bg-slate-900/60 border border-slate-700 rounded-xl overflow-hidden"
                >

                  {/* Camera Header */}

                  <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800">

                    <div>

                      <p className="text-xs text-slate-300 font-semibold">
                        {camera.name}
                      </p>

                      <p className="text-[10px] text-slate-500">
                        {camera.area} · {camera.location}
                      </p>

                    </div>

                    <span
                      className={cn(
                        "px-2 py-1 rounded text-[10px] font-bold border",
                        camera.color
                      )}
                    >
                      {camera.status}
                    </span>

                  </div>

                  {/* ==================================================
                      REAL VIDEO
                      ================================================== */}

                  <div className="relative aspect-video bg-black overflow-hidden">

                    <video
                      className="absolute inset-0 w-full h-full object-cover"
                      src={camera.video}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                    />

                    {/* Dark overlay for CCTV appearance */}

                    <div className="absolute inset-0 bg-black/10 pointer-events-none" />

                    {/* Scanline */}

                    <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(255,255,255,0.04)_4px)]" />

                    {/* ==================================================
                        CAMERA ID
                    ================================================== */}

                    <div className="absolute top-3 left-3 px-2 py-1 rounded bg-black/70 border border-slate-600 text-[10px] text-slate-200 font-medium">

                      {camera.id}

                    </div>

                    {/* ==================================================
                        REC STATUS
                    ================================================== */}

                    <div className="absolute top-3 right-3 flex items-center gap-2 px-2 py-1 rounded bg-black/70 border border-slate-600 text-[10px] text-slate-200">

                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />

                      <span>REC</span>

                      <span>{camera.signal}</span>

                    </div>

                    {/* ==================================================
                        TIMESTAMP
                    ================================================== */}

                    <div className="absolute bottom-3 right-3 text-[9px] font-mono text-white/90 bg-black/40 px-1 rounded">

                      {liveCameraTimestamp} UTC+05:30

                    </div>

                    {/* ==================================================
                        CAMERA LABEL
                    ================================================== */}

                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[9px] font-mono text-white/90 bg-black/40 px-1 rounded">

                      <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />

                      ROAD VIEW // LIVE FEED

                    </div>

                    {/* ==================================================
                        CROSSHAIR
                    ================================================== */}

                    <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 opacity-30 pointer-events-none">

                      <span className="absolute left-1/2 top-0 h-full w-px bg-cyan-300" />

                      <span className="absolute left-0 top-1/2 h-px w-full bg-cyan-300" />

                    </div>

                    {/* ==================================================
                        INCIDENT WARNING
                    ================================================== */}

                    {selectedIncident && (
                      <>

                        <div className="absolute left-6 top-10 w-16 h-10 border border-emerald-400/80 rounded-md" />

                        <div className="absolute right-8 top-12 w-20 h-12 border border-yellow-400/80 rounded-md" />

                        <div className="absolute bottom-5 left-5 px-2 py-1 rounded bg-black/70 text-[10px] text-red-300 border border-red-500/40">

                          {selectedIncident.severity} WARNING

                        </div>

                      </>
                    )}

                  </div>

                </div>

              ))}

            </div>

          </div>

          {/* ====================================================
              LIVE INCIDENT MAP
          ==================================================== */}

          <div className="bg-[#0d1524] border border-slate-800 rounded-xl overflow-hidden">

            <div className="flex items-center justify-between px-4 py-3 bg-slate-900/50 border-b border-slate-800">

              <div className="flex items-center gap-2">

                <MapPin className="h-4 w-4 text-red-400" />

                <span className="text-sm font-semibold text-white">
                  LIVE INCIDENT MAP
                </span>

              </div>

              <span className="text-xs text-emerald-400">
                CHENNAI CITY GRID / LIVE OPS
              </span>

            </div>

            <div className="relative bg-slate-900 h-96">

              {/* Map Header */}

              <div className="absolute left-4 top-4 z-10 rounded border border-cyan-500/30 bg-slate-950/80 px-3 py-2">

                <p className="text-[10px] font-mono tracking-widest text-cyan-300">
                  CHENNAI METROPOLITAN AREA
                </p>

                <p className="mt-1 text-[10px] text-slate-500">
                  13.0827 N / 80.2707 E · TRAFFIC CONTROL GRID
                </p>

              </div>

              {/* Grid */}

              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                  backgroundSize: "50px 50px",
                }}
              />

              {/* Roads */}

              <div className="absolute top-[54%] left-[-8%] h-1 w-[116%] rotate-[-18deg] bg-slate-600/70" />

              <div className="absolute top-[-12%] left-[48%] h-[125%] w-1 rotate-[14deg] bg-slate-600/70" />

              <div className="absolute top-[48%] left-[-8%] h-0.5 w-[116%] rotate-[22deg] bg-slate-700/70" />

              <div className="absolute top-[-10%] left-[67%] h-[125%] w-0.5 rotate-[35deg] bg-slate-700/70" />

              <div className="absolute top-[75%] left-[-4%] h-0.5 w-[110%] rotate-[-8deg] bg-cyan-500/30" />

              {/* Road Labels */}

              {chennaiMapLabels.map((road) => (

                <span
                  key={road.name}
                  className="absolute z-[1] text-[10px] font-mono tracking-wider text-slate-400/80"
                  style={{
                    top: road.top,
                    left: road.left,
                    transform: `rotate(${road.rotate})`,
                  }}
                >
                  {road.name}
                </span>

              ))}

              {/* Airport */}

              <div className="absolute left-[18%] top-[24%] rounded border border-blue-400/40 bg-blue-500/10 px-2 py-1 text-[9px] text-blue-300">

                CHENNAI AIRPORT

              </div>

              {/* Marina */}

              <div className="absolute right-[14%] bottom-[18%] rounded border border-cyan-400/40 bg-cyan-500/10 px-2 py-1 text-[9px] text-cyan-300">

                MARINA / ECR

              </div>

              <div className="absolute left-[57%] top-[63%] h-20 w-28 rounded-full border border-emerald-400/20" />

              {/* ==================================================
                  INCIDENT MARKER
              ================================================== */}

              {selectedIncident && (

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">

                  <div className="relative">

                    <div className="h-6 w-6 rounded-full bg-red-500 animate-ping absolute -inset-2" />

                    <div className="h-6 w-6 rounded-full bg-red-500 border-2 border-white flex items-center justify-center relative">

                      <AlertTriangle className="h-3 w-3 text-white" />

                    </div>

                  </div>

                  <span className="absolute left-8 top-0 whitespace-nowrap rounded bg-red-950/90 px-2 py-1 text-[10px] font-mono text-red-300">

                    INCIDENT // {selectedIncident.location.address}

                  </span>

                </div>

              )}

              {/* ==================================================
                  POLICE UNITS
              ================================================== */}

              {policeUnits
                .filter((u) => u.status !== "AVAILABLE")
                .map((unit, index) => (

                  <div
                    key={unit.unitId}
                    className="absolute"
                    style={{
                      top: `${30 + index * 15}%`,
                      left: `${20 + index * 20}%`,
                    }}
                  >

                    <div className="flex items-center gap-1 px-2 py-1 rounded bg-blue-500/20 border border-blue-500/50">

                      <Shield className="h-3 w-3 text-blue-400" />

                      <span className="text-[10px] text-blue-300 font-mono">
                        {unit.unitId}
                      </span>

                    </div>

                  </div>

                ))}

              {/* ==================================================
                  AMBULANCE
              ================================================== */}

              {selectedIncident?.ambulance && (

                <div className="absolute top-1/4 right-1/4">

                  <div className="flex items-center gap-1 px-2 py-1 rounded bg-red-500/20 border border-red-500/50">

                    <AmbulanceIcon className="h-3 w-3 text-red-400" />

                    <span className="text-[10px] text-red-300 font-mono">

                      {selectedIncident.ambulance.ambulanceId}

                    </span>

                  </div>

                </div>

              )}

              {/* ==================================================
                  HOSPITAL
              ================================================== */}

              {selectedIncident?.hospital && (

                <div className="absolute bottom-1/4 right-1/3">

                  <div className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/20 border border-emerald-500/50">

                    <Building2 className="h-3 w-3 text-emerald-400" />

                    <span className="text-[10px] text-emerald-300 font-mono">
                      HOSP
                    </span>

                  </div>

                </div>

              )}

              {/* ==================================================
                  MAP LEGEND
              ================================================== */}

              <div className="absolute bottom-4 left-4 space-y-1">

                <div className="flex items-center gap-2 text-xs text-slate-400">

                  <span className="h-3 w-3 rounded-full bg-red-500" />

                  Incident

                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">

                  <span className="h-3 w-3 rounded-full bg-blue-500" />

                  Police Unit

                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">

                  <span className="h-3 w-3 rounded-full bg-emerald-500" />

                  Hospital

                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">

                  <span className="h-3 w-3 rounded-full bg-red-400" />

                  Ambulance

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ======================================================
            RIGHT COLUMN
        ====================================================== */}

        <div className="space-y-6">

          {/* ====================================================
              ACTIVE INCIDENT
          ==================================================== */}

          {selectedIncident ? (

            <div className="bg-[#0d1524] border border-slate-800 rounded-xl overflow-hidden">

              <div className="px-4 py-3 bg-red-500/10 border-b border-red-500/30">

                <div className="flex items-center justify-between">

                  <span className="text-sm font-bold text-white">
                    ACTIVE INCIDENT
                  </span>

                  <span
                    className={cn(
                      "px-2 py-1 rounded text-xs font-bold border",
                      getSeverityColor(
                        selectedIncident.severity
                      )
                    )}
                  >
                    {selectedIncident.severity}
                  </span>

                </div>

              </div>

              <div className="p-4 space-y-4">

                <div>

                  <p className="text-2xl font-bold text-white font-mono">
                    {selectedIncident.incidentId}
                  </p>

                  <p className="text-sm text-slate-400 mt-1">
                    Confidence: {selectedIncident.confidence}%
                  </p>

                </div>

                <div className="space-y-2">

                  <div className="flex items-start gap-2">

                    <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />

                    <div>

                      <p className="text-sm text-slate-300">
                        {selectedIncident.location.address}
                      </p>

                      <p className="text-xs text-slate-500 font-mono">

                        {selectedIncident.location.lat.toFixed(4)},{" "}

                        {selectedIncident.location.lng.toFixed(4)}

                      </p>

                    </div>

                  </div>

                  <div className="flex items-center gap-2">

                    <Clock className="h-4 w-4 text-slate-400" />

                    <span className="text-sm text-slate-300">

                      Detected:{" "}

                      {new Date(
                        selectedIncident.createdAt
                      ).toLocaleTimeString()}

                    </span>

                  </div>

                </div>

                {/* Sources */}

                <div>

                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Incident Sources
                  </p>

                  <div className="flex flex-wrap gap-2">

                    {selectedIncident.sources.map(
                      (source, idx) => (

                        <span
                          key={idx}
                          className="px-2 py-1 rounded bg-slate-800 text-xs text-slate-300 border border-slate-700"
                        >
                          {source}
                        </span>

                      )
                    )}

                  </div>

                </div>

                {/* Merge Status */}

                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700">

                  <span className="text-xs text-slate-400">
                    Merge Status
                  </span>

                  <span
                    className={cn(
                      "text-xs font-bold",
                      selectedIncident.mergeStatus ===
                        "MERGED"
                        ? "text-emerald-400"
                        : "text-yellow-400"
                    )}
                  >
                    {selectedIncident.mergeStatus}
                  </span>

                </div>

                {/* Response Status */}

                <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700">

                  <span className="text-xs text-slate-400">
                    Response Status
                  </span>

                  <span className="text-xs font-bold text-blue-400">
                    {selectedIncident.coordinationStatus}
                  </span>

                </div>

              </div>

            </div>

          ) : (

            <div className="bg-[#0d1524] border border-slate-800 rounded-xl p-6 text-center">

              <p className="text-slate-400">
                No active incidents
              </p>

            </div>

          )}

          {/* ====================================================
              POLICE UNIT TRACKING
          ==================================================== */}

          <div className="bg-[#0d1524] border border-slate-800 rounded-xl overflow-hidden">

            <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-800">

              <div className="flex items-center gap-2">

                <Radio className="h-4 w-4 text-blue-400" />

                <span className="text-sm font-semibold text-white">
                  LIVE UNIT TRACKING
                </span>

              </div>

            </div>

            <div className="p-4 space-y-3">

              {policeUnits.filter(
                (u) => u.status !== "AVAILABLE"
              ).length > 0 ? (

                policeUnits
                  .filter(
                    (u) => u.status !== "AVAILABLE"
                  )
                  .map((unit) => (

                    <div
                      key={unit.unitId}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700"
                    >

                      <div>

                        <p className="text-sm font-semibold text-white font-mono">
                          {unit.unitId}
                        </p>

                        <p className="text-xs text-slate-400">
                          {unit.unitType}
                        </p>

                      </div>

                      <div className="text-right">

                        <span
                          className={cn(
                            "px-2 py-1 rounded text-xs font-bold",
                            getUnitStatusColor(
                              unit.status
                            )
                          )}
                        >
                          {unit.status.replace(
                            "_",
                            " "
                          )}
                        </span>

                        <p className="text-xs text-slate-400 mt-1">

                          ETA:{" "}

                          {unit.eta ??
                            unit.etaMinutes ??
                            0}{" "}

                          min

                        </p>

                      </div>

                    </div>

                  ))

              ) : (

                <p className="text-sm text-slate-400 text-center py-4">
                  No units currently deployed
                </p>

              )}

            </div>

          </div>

          {/* ====================================================
              RESPONSE RESOURCES
          ==================================================== */}

          {selectedIncident && (

            <div className="bg-[#0d1524] border border-slate-800 rounded-xl overflow-hidden">

              <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-800">

                <span className="text-sm font-semibold text-white">
                  RESPONSE RESOURCES
                </span>

              </div>

              <div className="p-4 space-y-3">

                {/* Hospital */}

                {selectedIncident.hospital && (

                  <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">

                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-2">

                        <Building2 className="h-4 w-4 text-emerald-400" />

                        <span className="text-sm text-slate-300">
                          {
                            selectedIncident.hospital
                              .hospitalName
                          }
                        </span>

                      </div>

                      <span className="text-xs text-emerald-400 font-bold">

                        {
                          selectedIncident.hospital
                            .acceptanceStatus
                        }

                      </span>

                    </div>

                    <p className="text-xs text-slate-400 mt-1">

                      Trauma Level:{" "}

                      {
                        selectedIncident.hospital
                          .traumaLevel
                      }

                    </p>

                  </div>

                )}

                {/* Ambulance */}

                {selectedIncident.ambulance && (

                  <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">

                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-2">

                        <AmbulanceIcon className="h-4 w-4 text-red-400" />

                        <span className="text-sm text-slate-300 font-mono">

                          {
                            selectedIncident
                              .ambulance
                              .ambulanceId
                          }

                        </span>

                      </div>

                      <span className="text-xs text-yellow-400 font-bold">

                        {
                          selectedIncident
                            .ambulance.status
                        }

                      </span>

                    </div>

                    <p className="text-xs text-slate-400 mt-1">

                      ETA:{" "}

                      {
                        selectedIncident
                          .ambulance
                          .etaMinutes
                      }{" "}

                      min

                    </p>

                  </div>

                )}

              </div>

            </div>

          )}

          {/* ====================================================
              INCIDENT TIMELINE
          ==================================================== */}

          {selectedIncident && (

            <div className="bg-[#0d1524] border border-slate-800 rounded-xl overflow-hidden">

              <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-800">

                <div className="flex items-center gap-2">

                  <Clock className="h-4 w-4 text-slate-400" />

                  <span className="text-sm font-semibold text-white">
                    INCIDENT TIMELINE
                  </span>

                </div>

              </div>

              <div className="p-4">

                <div className="space-y-3">

                  {selectedIncident.timeline.map(
                    (event, idx) => (

                      <div
                        key={idx}
                        className="flex gap-3"
                      >

                        <div className="flex flex-col items-center">

                          <div className="h-2 w-2 rounded-full bg-red-400 mt-1.5" />

                          {idx <
                            selectedIncident.timeline
                              .length -
                              1 && (

                            <div className="w-px flex-1 bg-slate-700" />

                          )}

                        </div>

                        <div className="pb-3">

                          <p className="text-xs text-slate-500 font-mono">
                            {event.timestamp}
                          </p>

                          <p className="text-sm text-slate-300">
                            {event.event}
                          </p>

                          {event.details && (

                            <p className="text-xs text-slate-500 mt-0.5">
                              {event.details}
                            </p>

                          )}

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}