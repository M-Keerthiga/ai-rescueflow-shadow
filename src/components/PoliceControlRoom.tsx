import { useEffect, useRef, useState } from "react";
import {
  emergencyService,
  type Incident,
  type PoliceUnit,
} from "@/lib/emergencyService";

import {
  Shield,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Users,
  Video,
  Camera,
  Play,
  Pause,
} from "lucide-react";

import { cn } from "@/lib/utils";

// IMPORT YOUR LOCAL VIDEOS
import camera1 from "@/assets/cameras/camera 1.mp4";
import camera2 from "@/assets/cameras/camera 2.mp4";
import camera3 from "@/assets/cameras/camera 3.mp4";
import camera4 from "@/assets/cameras/camera 4.mp4";

// Local camera data
const cameraVideos = [
  {
    id: "CAM-001",
    name: "Highway Junction - North",
    location: "NH-45, Junction 12",
    url: camera1,
    status: "LIVE",
    type: "Traffic Camera",
  },
  {
    id: "CAM-002",
    name: "City Intersection - Main",
    location: "MG Road, Central",
    url: camera2,
    status: "LIVE",
    type: "Traffic Camera",
  },
  {
    id: "CAM-003",
    name: "Expressway - South",
    location: "Outer Ring Road",
    url: camera3,
    status: "LIVE",
    type: "Highway Camera",
  },
  {
    id: "CAM-004",
    name: "Bridge Crossing - East",
    location: "River Bridge, East Side",
    url: camera4,
    status: "LIVE",
    type: "Surveillance Camera",
  },
];

interface PoliceControlRoomProps {
  incidents: Incident[];
  onRefresh: () => void | Promise<void>;
}

export function PoliceControlRoom({
  incidents,
  onRefresh,
}: PoliceControlRoomProps) {
  const [policeUnits, setPoliceUnits] = useState<PoliceUnit[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeCamera, setActiveCamera] = useState(cameraVideos[0]);

  const [isPlaying, setIsPlaying] = useState(true);

  // Reference to actual video element
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    loadPoliceUnits();
  }, []);

  const loadPoliceUnits = async () => {
    setLoading(true);

    try {
      const data = await emergencyService.getPoliceUnits();
      setPoliceUnits(data || []);
    } catch (error) {
      console.error("Failed to load police units:", error);
      setPoliceUnits([]);
    } finally {
      setLoading(false);
    }
  };

  // REAL PLAY / PAUSE
  const togglePlayPause = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Change camera
  const changeCamera = (camera: typeof cameraVideos[number]) => {
    setActiveCamera(camera);
    setIsPlaying(true);

    // Wait for new video to render and then play
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }, 100);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      AVAILABLE: "bg-emerald-500/20 text-emerald-400",
      ASSIGNED: "bg-blue-500/20 text-blue-400",
      EN_ROUTE: "bg-yellow-500/20 text-yellow-400",
      ON_SCENE: "bg-orange-500/20 text-orange-400",
      COMPLETED: "bg-slate-500/20 text-slate-400",
    };

    return colors[status] || colors.AVAILABLE;
  };

  const getSeverityColor = (severity: string) => {
    const colors: Record<string, string> = {
      LOW: "bg-emerald-500/20 text-emerald-400",
      MODERATE: "bg-yellow-500/20 text-yellow-400",
      HIGH: "bg-orange-500/20 text-orange-400",
      CRITICAL: "bg-red-500/20 text-red-400",
      CATASTROPHIC: "bg-purple-500/20 text-purple-400",
    };

    return colors[severity] || colors.LOW;
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="bg-[#0d1524] border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              POLICE CONTROL ROOM
            </h2>

            <p className="text-sm text-slate-400 mt-1">
              Live surveillance and police unit coordination
            </p>
          </div>

          <button
            onClick={loadPoliceUnits}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
          </button>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Shield className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wider">
                Total Units
              </span>
            </div>

            <p className="text-2xl font-bold text-white mt-2">
              {policeUnits.length}
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <CheckCircle2 className="h-4 w-4" />

              <span className="text-xs font-medium uppercase tracking-wider">
                Available
              </span>
            </div>

            <p className="text-2xl font-bold text-emerald-400 mt-2">
              {policeUnits.filter(
                (u) => u.status === "AVAILABLE"
              ).length}
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <AlertTriangle className="h-4 w-4" />

              <span className="text-xs font-medium uppercase tracking-wider">
                En Route
              </span>
            </div>

            <p className="text-2xl font-bold text-yellow-400 mt-2">
              {policeUnits.filter(
                (u) => u.status === "EN_ROUTE"
              ).length}
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Users className="h-4 w-4" />

              <span className="text-xs font-medium uppercase tracking-wider">
                On Scene
              </span>
            </div>

            <p className="text-2xl font-bold text-orange-400 mt-2">
              {policeUnits.filter(
                (u) => u.status === "ON_SCENE"
              ).length}
            </p>
          </div>

        </div>
      </div>

      {/* LIVE CAMERA SECTION */}
      <div className="bg-[#0d1524] border border-slate-800 rounded-xl overflow-hidden">

        <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between">

          <div className="flex items-center gap-2">
            <Video className="h-4 w-4 text-red-400" />

            <h3 className="text-sm font-semibold text-white">
              LIVE SURVEILLANCE FEED
            </h3>
          </div>

          <span className="flex items-center gap-2 text-xs text-red-400 font-bold">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            LIVE
          </span>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">

          {/* VIDEO PLAYER */}
          <div className="lg:col-span-2 bg-black rounded-lg overflow-hidden relative">

            <video
              ref={videoRef}
              key={activeCamera.id}
              className="w-full aspect-video object-cover"
              autoPlay
              muted
              loop
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source
                src={activeCamera.url}
                type="video/mp4"
              />

              Your browser does not support video playback.
            </video>

            {/* TOP OVERLAY */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-white font-bold">
                    {activeCamera.name}
                  </p>

                  <p className="text-xs text-slate-300 mt-1">
                    {activeCamera.location}
                  </p>
                </div>

                <span className="px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30">
                  {activeCamera.status}
                </span>

              </div>

            </div>

            {/* VIDEO CONTROLS */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">

              <div className="flex items-center gap-2">

                <button
                  onClick={togglePlayPause}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </button>

                <span className="text-xs text-slate-300 font-mono">
                  {activeCamera.id}
                </span>

                <span className="ml-auto text-xs text-slate-300">
                  {activeCamera.type}
                </span>

              </div>

            </div>

          </div>

          {/* CAMERA LIST */}
          <div className="space-y-2">

            {cameraVideos.map((camera) => (

              <button
                key={camera.id}
                onClick={() => changeCamera(camera)}
                className={cn(
                  "w-full p-3 rounded-lg border text-left transition-colors",

                  activeCamera.id === camera.id
                    ? "bg-red-500/10 border-red-500/30"
                    : "bg-slate-800/50 border-slate-700 hover:bg-slate-800"
                )}
              >

                <div className="flex items-center gap-3">

                  <div className="h-8 w-8 rounded bg-slate-700 flex items-center justify-center">
                    <Camera className="h-4 w-4 text-slate-300" />
                  </div>

                  <div className="flex-1 min-w-0">

                    <p className="text-sm font-medium text-white truncate">
                      {camera.name}
                    </p>

                    <p className="text-xs text-slate-400 truncate">
                      {camera.location}
                    </p>

                  </div>

                  <span className="flex items-center gap-1 text-xs text-red-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                    LIVE
                  </span>

                </div>

              </button>

            ))}

          </div>

        </div>
      </div>

      {/* POLICE UNITS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {policeUnits.map((unit) => (

          <div
            key={unit.unitId}
            className="bg-[#0d1524] border border-slate-800 rounded-xl overflow-hidden"
          >

            <div className="p-5">

              <div className="flex items-start justify-between">

                <div>
                  <h3 className="text-lg font-bold text-white font-mono">
                    {unit.unitId}
                  </h3>

                  <p className="text-sm text-slate-400 mt-1">
                    {unit.unitType}
                  </p>
                </div>

                <span
                  className={cn(
                    "px-2 py-1 rounded text-xs font-bold",
                    getStatusColor(unit.status)
                  )}
                >
                  {unit.status?.replace("_", " ") || "UNKNOWN"}
                </span>

              </div>

              {/* UNIT DETAILS */}
              <div className="mt-4 space-y-2">

                {unit.currentLocation && (
                  <div className="flex items-center gap-2 text-sm">

                    <MapPin className="h-4 w-4 text-slate-400" />

                    <span className="text-slate-300">
                      {unit.currentLocation.lat?.toFixed(4)},{" "}
                      {unit.currentLocation.lng?.toFixed(4)}
                    </span>

                  </div>
                )}

                {unit.etaMinutes !== undefined &&
                  unit.etaMinutes !== null && (
                    <div className="flex items-center gap-2 text-sm">

                      <Clock className="h-4 w-4 text-slate-400" />

                      <span className="text-slate-300">
                        ETA: {unit.etaMinutes} min
                      </span>

                    </div>
                  )}

              </div>

              {/* ASSIGNMENT */}
              {unit.incidentId && (

                <div className="mt-4 p-3 rounded-lg bg-slate-800/50 border border-slate-700">

                  <p className="text-xs text-slate-400">
                    Assigned to
                  </p>

                  <p className="text-sm font-bold text-white font-mono mt-1">
                    {unit.incidentId}
                  </p>

                  {unit.assignmentTime && (
                    <p className="text-xs text-slate-400 mt-1">
                      Assigned:{" "}
                      {new Date(
                        unit.assignmentTime
                      ).toLocaleTimeString()}
                    </p>
                  )}

                </div>

              )}

            </div>

          </div>

        ))}

      </div>

      {/* ACTIVE ASSIGNMENTS */}
      {incidents?.length > 0 && (

        <div className="bg-[#0d1524] border border-slate-800 rounded-xl overflow-hidden">

          <div className="px-4 py-3 bg-slate-900/50 border-b border-slate-800">

            <h3 className="text-sm font-semibold text-white">
              ACTIVE POLICE ASSIGNMENTS
            </h3>

          </div>

          <div className="divide-y divide-slate-800">

            {incidents
              .filter(
                (inc) => inc.police.length > 0
              )
              .map((incident) => (

                <div
                  key={incident.incidentId}
                  className="p-4"
                >

                  <div className="flex items-center justify-between mb-3">

                    <div>

                      <p className="text-sm font-bold text-white font-mono">
                        {incident.incidentId}
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        {incident.location?.address}
                      </p>

                    </div>

                    <span
                      className={cn(
                        "px-2 py-1 rounded text-xs font-bold",
                        getSeverityColor(
                          incident.severity
                        )
                      )}
                    >
                      {incident.severity}
                    </span>

                  </div>

                  <div className="flex flex-wrap gap-2">

                    {incident.police.map(
                      (unit, idx) => (

                        <span
                          key={idx}
                          className="px-2 py-1 rounded bg-slate-800 text-xs text-slate-300 border border-slate-700"
                        >
                          {unit.unitId} -{" "}
                          {unit.unitType}
                        </span>

                      )
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
