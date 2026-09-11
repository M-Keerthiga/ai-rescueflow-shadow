import React, { useEffect, useMemo, useState } from "react";
import {
  Shield,
  AlertTriangle,
  Hospital,
  Clock,
  Radio,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Ambulance,
  FileText,
  Activity,
  RefreshCw,
  Video,
  Users,
  Siren,
  Navigation,
  Wifi,
  X,
  Car,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext.jsx";

import {
  getHospitalsForLocation,
  SIMULATION_DISCLAIMER,
} from "../services/hospitalService.js";

/* ============================================================
   CAMERA DATA
   ============================================================ */

const cameraFeeds = [
  {
    id: "TN-04",
    name: "Kathipara Flyover",
    area: "CHENNAI SOUTH",
    location: "GST Road / Inner Ring Road",
    signal: "94%",
    video: "/cameras/camera 1.mp4",
    alertType: "SAFE",
  },
  {
    id: "TN-12",
    name: "Anna Salai Junction",
    area: "CHENNAI CENTRAL",
    location: "Saidapet / Guindy",
    signal: "91%",
    video: "/cameras/camera 2.mp4",
    alertType: "DANGER",
  },
  {
    id: "TN-21",
    name: "OMR Tech Corridor",
    area: "CHENNAI EAST",
    location: "Taramani / Sholinganallur",
    signal: "88%",
    video: "/cameras/camera 3.mp4",
    alertType: "WARNING",
  },
  {
    id: "TN-31",
    name: "ECR Coastal Road",
    area: "CHENNAI SOUTH",
    location: "Adyar / Thiruvanmiyur",
    signal: "77%",
    video: "/cameras/camera 4.mp4",
    alertType: "EMERGENCY",
  },
];

/* ============================================================
   ALERT CONFIG
   ============================================================ */

function getAlertConfig(type) {
  const configs = {
    SAFE: {
      label: "SAFE",
      text: "text-emerald-400",
      border: "border-emerald-500/50",
      bg: "bg-emerald-500/10",
      dot: "bg-emerald-400",
    },
    DANGER: {
      label: "DANGER",
      text: "text-red-400",
      border: "border-red-500/60",
      bg: "bg-red-500/10",
      dot: "bg-red-500",
    },
    WARNING: {
      label: "WARNING",
      text: "text-yellow-400",
      border: "border-yellow-500/60",
      bg: "bg-yellow-500/10",
      dot: "bg-yellow-400",
    },
    EMERGENCY: {
      label: "EMERGENCY",
      text: "text-red-400",
      border: "border-red-500/70",
      bg: "bg-red-500/15",
      dot: "bg-red-500",
    },
  };

  return configs[type] || configs.SAFE;
}

/* ============================================================
   TIME FORMAT
   ============================================================ */

function formatTime(value) {
  if (!value) return new Date().toLocaleString();

  try {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return date.toLocaleString();
  } catch {
    return String(value);
  }
}

/* ============================================================
   CAMERA CARD
   ============================================================ */

function CameraCard({ camera }) {
  const alert = getAlertConfig(camera.alertType);

  return (
    <div
      className={`rounded-lg overflow-hidden border bg-[#090f1b] shadow-xl ${
        camera.alertType === "EMERGENCY"
          ? "border-red-500/60 shadow-red-950/30"
          : "border-slate-800"
      }`}
    >
      {/* CAMERA HEADER */}
      <div className="h-11 px-3 flex items-center justify-between bg-[#111a2a] border-b border-slate-800">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className={`w-2 h-2 rounded-full ${alert.dot} ${
              camera.alertType !== "SAFE" ? "animate-pulse" : ""
            }`}
          />

          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-200 truncate uppercase">
              {camera.name}
            </p>

            <p className="text-[8px] text-slate-600 font-mono truncate">
              {camera.area} // {camera.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[8px] text-emerald-400 font-mono">
            {camera.signal}
          </span>

          <span className="px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-[7px] text-red-400 font-bold">
            REC
          </span>
        </div>
      </div>

      {/* VIDEO */}
      <div className="relative aspect-video bg-black overflow-hidden">
        <video
          src={camera.video}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* CONTROL ROOM OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70 pointer-events-none" />

        {/* SCANLINES */}
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-[linear-gradient(to_bottom,transparent_50%,rgba(255,255,255,0.2)_50%)] bg-[length:100%_4px]" />

        {/* CAMERA ID */}
        <div className="absolute top-2 left-2 px-2 py-1 bg-black/75 border border-slate-700 rounded text-[8px] font-mono text-white">
          CAM {camera.id}
        </div>

        {/* AI */}
        <div className="absolute top-2 right-2 px-2 py-1 bg-black/75 border border-cyan-500/20 rounded text-[7px] font-mono text-cyan-300">
          AI VISION ACTIVE
        </div>

        {/* CROSSHAIR */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative w-10 h-10 opacity-40">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cyan-300" />
            <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-300" />
            <div className="absolute inset-2 border border-cyan-300 rounded-full" />
          </div>
        </div>

        {/* DETECTION BOXES */}
        <div className="absolute left-[12%] top-[20%] w-[18%] h-[18%] border border-emerald-400/70 rounded" />

        <div className="absolute right-[12%] top-[25%] w-[20%] h-[20%] border border-yellow-400/70 rounded" />

        {/* ALERT */}
        <div
          className={`absolute left-2 bottom-2 flex items-center gap-1.5 px-2 py-1 rounded border ${alert.border} ${alert.bg} backdrop-blur`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${alert.dot} ${
              camera.alertType !== "SAFE" ? "animate-pulse" : ""
            }`}
          />

          <span className={`text-[7px] font-bold ${alert.text}`}>
            {camera.alertType === "SAFE"
              ? "NORMAL TRAFFIC"
              : `${alert.label} // AI DETECTION`}
          </span>
        </div>

        <div className="absolute right-2 bottom-2 text-[7px] text-slate-300 font-mono">
          LIVE // UTC+05:30
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN POLICE DASHBOARD
   ============================================================ */

export default function PoliceDashboard() {
  const navigate = useNavigate();

  const {
    activeIncident,
    policeStatus,
    hospitalStatus,
    assignedHospital,
    assignedAmbulance,
    ambulanceTracking,
    acknowledgePoliceIncident,
  } = useApp();

  const [recommendedHospitals, setRecommendedHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showIncomingPopup, setShowIncomingPopup] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /* ============================================================
     INCIDENT DATA
     ============================================================ */

  const safeAmbulanceTracking = ambulanceTracking || {};

  const accidentLocation =
    activeIncident?.location ||
    activeIncident?.telemetry?.location ||
    "Chennai Outer Ring Road";

  const incidentId =
    activeIncident?.id ||
    activeIncident?.incidentId ||
    "INC-CHN-2401";

  const incidentTimestamp =
    activeIncident?.timestamp ||
    activeIncident?.createdAt ||
    new Date();

  const severityLevel =
    activeIncident?.severityLevel ||
    activeIncident?.severity?.level ||
    activeIncident?.severity ||
    "CATASTROPHIC";

  const riskScore =
    activeIncident?.severityScore ||
    activeIncident?.telemetry?.riskAtCollision ||
    96;

  const incidentDescription =
    activeIncident?.severity?.description ||
    `High-energy collision detected at ${accidentLocation}. AI vision analysis indicates severe vehicle deformation with a high probability of life-threatening trauma. Immediate police, ambulance and hospital coordination is required.`;

  /* ============================================================
     HOSPITAL DATA
     ============================================================ */

  useEffect(() => {
    const hospitals =
      getHospitalsForLocation(accidentLocation) || [];

    setRecommendedHospitals(hospitals);

    if (hospitals.length > 0) {
      setSelectedHospital((current) => {
        if (assignedHospital) return assignedHospital;
        if (current) return current;
        return hospitals[0];
      });
    }
  }, [accidentLocation, assignedHospital]);

  /* ============================================================
     ACKNOWLEDGE + DISPATCH
     ============================================================ */

  const handleAcknowledgeAndDispatch = () => {
    const targetHospital =
      selectedHospital ||
      assignedHospital ||
      recommendedHospitals[0];

    acknowledgePoliceIncident(targetHospital);

    setShowIncomingPopup(false);

    navigate("/hospital-dashboard");
  };

  /* ============================================================
     VIEW HOSPITAL LIST
     
     IMPORTANT:
     This button ONLY navigates to the existing
     Hospital Dashboard.
     ============================================================ */

  const handleViewHospitalList = () => {
    navigate("/hospital-dashboard");
  };

  /* ============================================================
     REFRESH
     ============================================================ */

  const handleRefresh = () => {
    setRefreshing(true);
    window.location.reload();
  };

  /* ============================================================
     RESPONSE STATUS
     ============================================================ */

  const isAmbulanceDispatched =
    policeStatus === "EN_ROUTE" ||
    policeStatus === "AMBULANCE_DISPATCHED" ||
    policeStatus === "PATROL_AT_SCENE";

  const policeStateLabel = useMemo(() => {
    if (policeStatus === "EN_ROUTE") {
      return "EN ROUTE TO SCENE";
    }

    if (policeStatus === "PATROL_AT_SCENE") {
      return "PATROL AT SCENE";
    }

    if (policeStatus === "AMBULANCE_DISPATCHED") {
      return "AMBULANCE DISPATCHED";
    }

    return policeStatus || "MONITORING";
  }, [policeStatus]);

  const ambulanceEta =
    safeAmbulanceTracking.status === "ARRIVED_AT_SCENE"
      ? "0 MIN"
      : `${
          safeAmbulanceTracking.etaMinutes ||
          selectedHospital?.etaMinutes ||
          8
        } MIN`;

  /* ============================================================
     METRICS
     ============================================================ */

  const activeIncidentCount = activeIncident ? 1 : 0;

  const unitsAvailable =
    policeStatus === "AVAILABLE" ? 4 : 3;

  const unitsDeployed =
    isAmbulanceDispatched ? 1 : 0;

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <div className="min-h-screen bg-[#050912] text-slate-200 font-sans">

      <div className="max-w-[1700px] mx-auto p-3 lg:p-5 space-y-4">

        {/* ======================================================
            TOP SIMULATION BAR
        ====================================================== */}

        <div className="h-8 px-3 flex items-center justify-between rounded-md border border-amber-500/20 bg-amber-500/5">

          <div className="flex items-center gap-2 min-w-0">
            <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />

            <span className="text-[8px] font-mono text-amber-300 uppercase truncate">
              {SIMULATION_DISCLAIMER}
            </span>
          </div>

          <span className="text-[7px] font-mono text-amber-400 border border-amber-500/20 px-2 py-1 rounded shrink-0">
            CAD SIMULATION
          </span>
        </div>

        {/* ======================================================
            POLICE CONTROL ROOM HEADER
        ====================================================== */}

        <header className="border border-slate-800 bg-[#0b1220] rounded-lg overflow-hidden shadow-2xl">

          <div className="px-5 py-4 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="relative w-11 h-11 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center">

                <Shield className="w-5 h-5 text-red-400" />

                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0b1220]" />
              </div>

              <div>

                <div className="flex items-center gap-2">
                  <span className="text-[8px] text-red-400 font-mono tracking-[0.25em]">
                    CHENNAI POLICE
                  </span>

                  <span className="text-[7px] text-slate-700">
                    //
                  </span>

                  <span className="text-[8px] text-slate-600 font-mono">
                    EMERGENCY OPERATIONS
                  </span>
                </div>

                <h1 className="text-xl lg:text-2xl font-black text-white tracking-tight">
                  POLICE EMERGENCY CONTROL ROOM
                </h1>

                <p className="text-[9px] text-slate-500 font-mono mt-0.5">
                  REAL-TIME INCIDENT COMMAND // AI-ASSISTED RESPONSE COORDINATION
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">

              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-md border border-emerald-500/20 bg-emerald-500/5">

                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />

                <span className="text-[8px] font-bold text-emerald-400">
                  SYSTEM ONLINE
                </span>
              </div>

              <button
                type="button"
                onClick={handleRefresh}
                className="w-8 h-8 rounded-md border border-slate-700 bg-slate-900 flex items-center justify-center hover:bg-slate-800"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 text-slate-400 ${
                    refreshing ? "animate-spin" : ""
                  }`}
                />
              </button>
            </div>
          </div>

          {/* PRIORITY CHANNEL */}

          <div className="border-t border-slate-800 px-5 py-2 flex items-center gap-3">

            <span className="text-[7px] text-red-400 font-mono font-bold tracking-widest">
              PRIORITY CHANNEL
            </span>

            <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />

            <span className="text-[7px] text-slate-600 font-mono truncate">
              {incidentId} // {accidentLocation} // EMERGENCY RESPONSE CHANNEL ACTIVE
            </span>

            <span className="ml-auto hidden md:block text-[7px] text-emerald-400 font-mono">
              ENCRYPTED UPLINK
            </span>
          </div>

          {/* METRICS */}

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-800">

            <MetricCard
              icon={<Activity className="w-4 h-4" />}
              title="ACTIVE INCIDENTS"
              value={activeIncidentCount}
              valueClass="text-white"
            />

            <MetricCard
              icon={<Shield className="w-4 h-4" />}
              title="UNITS AVAILABLE"
              value={unitsAvailable}
              valueClass="text-emerald-400"
            />

            <MetricCard
              icon={<Users className="w-4 h-4" />}
              title="UNITS DEPLOYED"
              value={unitsDeployed}
              valueClass="text-yellow-400"
            />

            <MetricCard
              icon={<AlertTriangle className="w-4 h-4" />}
              title="CRITICAL INCIDENTS"
              value={
                severityLevel === "CRITICAL" ||
                severityLevel === "CATASTROPHIC"
                  ? 1
                  : 0
              }
              valueClass="text-red-400"
            />

          </div>
        </header>

        {/* ======================================================
            MAIN CONTROL ROOM
        ====================================================== */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* ====================================================
              LEFT / CAMERA + MAP
          ==================================================== */}

          <div className="xl:col-span-2 space-y-4">

            {/* CAMERA GRID */}

            <section className="bg-[#0b1220] border border-slate-800 rounded-lg overflow-hidden">

              <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <Video className="w-4 h-4 text-red-400" />

                  <div>
                    <h2 className="text-xs font-bold text-white tracking-wide">
                      LIVE SURVEILLANCE NETWORK
                    </h2>

                    <p className="text-[7px] text-slate-600 font-mono">
                      AI VISION // TRAFFIC CAMERA MONITORING
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">

                  <Wifi className="w-3 h-3 text-emerald-400" />

                  <span className="text-[8px] text-emerald-400 font-mono">
                    4 STREAMS ACTIVE
                  </span>
                </div>
              </div>

              <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-3">

                {cameraFeeds.map((camera) => (
                  <CameraCard
                    key={camera.id}
                    camera={camera}
                  />
                ))}

              </div>
            </section>

            {/* ==================================================
                INCIDENT MAP
            ================================================== */}

            <section className="bg-[#0b1220] border border-slate-800 rounded-lg overflow-hidden">

              <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <Navigation className="w-4 h-4 text-cyan-400" />

                  <div>
                    <h2 className="text-xs font-bold text-white">
                      INCIDENT COMMAND MAP
                    </h2>

                    <p className="text-[7px] text-slate-600 font-mono">
                      POLICE // HOSPITAL // AMBULANCE
                    </p>
                  </div>
                </div>

                <span className="flex items-center gap-1.5 text-[8px] text-emerald-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  NETWORK SYNCED
                </span>
              </div>

              <div className="relative h-[320px] bg-[#06101b] overflow-hidden">

                {/* GRID */}

                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(71,85,105,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(71,85,105,0.25) 1px, transparent 1px)",
                    backgroundSize: "35px 35px",
                  }}
                />

                {/* ROADS */}

                <div className="absolute left-[8%] top-[-20%] w-[25%] h-[140%] border-x border-slate-700/50 rotate-[18deg]" />

                <div className="absolute right-[15%] top-[-20%] w-[18%] h-[140%] border-x border-slate-700/50 rotate-[-25deg]" />

                <div className="absolute left-0 right-0 top-[54%] border-t border-dashed border-slate-700/60" />

                {/* INCIDENT */}

                <div className="absolute left-[48%] top-[40%]">

                  <div className="absolute -inset-8 rounded-full border border-red-500/20 animate-ping" />

                  <div className="relative w-11 h-11 rounded-full bg-red-600 border-2 border-white shadow-xl flex items-center justify-center">
                    <Siren className="w-5 h-5 text-white" />
                  </div>

                  <div className="absolute top-13 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 border border-red-500/30 rounded px-2 py-1">

                    <span className="text-[7px] text-red-400 font-mono font-bold">
                      {incidentId}
                    </span>
                  </div>
                </div>

                {/* MAP MARKERS */}

                <MapMarker
                  type="H"
                  label="HOSPITAL"
                  position="left-[20%] top-[24%]"
                  className="bg-blue-600"
                />

                <MapMarker
                  type="H"
                  label="HOSPITAL"
                  position="right-[20%] top-[65%]"
                  className="bg-blue-600"
                />

                <MapMarker
                  type="P"
                  label="POLICE"
                  position="left-[67%] top-[18%]"
                  className="bg-violet-600"
                />

                <MapMarker
                  type="P"
                  label="POLICE"
                  position="left-[30%] top-[72%]"
                  className="bg-violet-600"
                />

                <MapMarker
                  type="A"
                  label="AMBULANCE"
                  position="right-[32%] top-[40%]"
                  className="bg-emerald-600"
                />

                {/* LEGEND */}

                <div className="absolute bottom-3 left-3 bg-black/90 border border-slate-700 rounded-md p-2.5">

                  <p className="text-[7px] text-slate-500 font-mono mb-2">
                    COMMAND NETWORK
                  </p>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">

                    <LegendItem
                      color="bg-red-500"
                      text="INCIDENT"
                    />

                    <LegendItem
                      color="bg-blue-500"
                      text="HOSPITAL"
                    />

                    <LegendItem
                      color="bg-violet-500"
                      text="POLICE"
                    />

                    <LegendItem
                      color="bg-emerald-500"
                      text="AMBULANCE"
                    />

                  </div>
                </div>

                {/* MAP STATUS */}

                <div className="absolute top-3 right-3 bg-black/90 border border-emerald-500/20 rounded-md px-2 py-1.5">

                  <span className="text-[7px] text-emerald-400 font-mono">
                    GPS NETWORK // ACTIVE
                  </span>
                </div>
              </div>
            </section>
          </div>

          {/* ====================================================
              RIGHT COMMAND PANEL
          ==================================================== */}

          <div className="space-y-4">

            {/* ACTIVE INCIDENT */}

            <section className="bg-[#0b1220] border border-red-500/30 rounded-lg overflow-hidden shadow-xl shadow-red-950/10">

              <div className="px-4 py-3 bg-red-500/10 border-b border-red-500/20 flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />

                  <span className="text-xs font-bold text-white">
                    ACTIVE INCIDENT
                  </span>
                </div>

                <span className="px-2 py-1 rounded bg-red-500/15 border border-red-500/30 text-[8px] text-red-400 font-bold">
                  {severityLevel}
                </span>
              </div>

              <div className="p-4 space-y-4">

                <div>
                  <p className="text-[7px] text-slate-600 font-mono">
                    INCIDENT NUMBER
                  </p>

                  <h2 className="text-lg font-black text-white font-mono mt-1">
                    {incidentId}
                  </h2>

                  <p className="text-[8px] text-slate-500 mt-1">
                    AI CONFIDENCE:{" "}
                    <span className="text-cyan-400">
                      {activeIncident?.confidence || 96}%
                    </span>
                  </p>
                </div>

                {/* LOCATION */}

                <div className="rounded-md bg-slate-950 border border-slate-800 p-3">

                  <div className="flex gap-2">

                    <MapPin className="w-4 h-4 text-red-400 shrink-0" />

                    <div>
                      <p className="text-[10px] text-white font-bold">
                        {accidentLocation}
                      </p>

                      <p className="text-[7px] text-slate-600 font-mono mt-1">
                        {activeIncident?.latitude ||
                          activeIncident?.telemetry?.location?.lat ||
                          "13.0368"}
                        {" , "}
                        {activeIncident?.longitude ||
                          activeIncident?.telemetry?.location?.lng ||
                          "80.2084"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* TIME */}

                <div className="flex items-center justify-between">

                  <span className="text-[8px] text-slate-600">
                    DETECTION TIME
                  </span>

                  <span className="text-[8px] text-slate-300 font-mono">
                    {formatTime(incidentTimestamp)}
                  </span>
                </div>

                {/* INCIDENT SOURCES */}

                <div>

                  <p className="text-[7px] text-slate-600 font-bold tracking-wider mb-2">
                    INCIDENT SOURCES
                  </p>

                  <div className="flex flex-wrap gap-1.5">

                    <SourceBadge>
                      AI CAMERA TN-04
                    </SourceBadge>

                    <SourceBadge>
                      CITIZEN CR-7812
                    </SourceBadge>

                    <SourceBadge>
                      TRAFFIC CONTROL
                    </SourceBadge>
                  </div>
                </div>

                {/* DESCRIPTION */}

                <div className="border-t border-slate-800 pt-3">

                  <p className="text-[7px] text-slate-600 font-bold tracking-wider mb-2">
                    AI INCIDENT ASSESSMENT
                  </p>

                  <p className="text-[9px] text-slate-400 leading-relaxed">
                    {incidentDescription}
                  </p>
                </div>

                {/* STATUS GRID */}

                <div className="grid grid-cols-2 gap-2">

                  <StatusBox
                    title="POLICE"
                    value={policeStatus || "ASSIGNED"}
                    color="text-blue-400"
                  />

                  <StatusBox
                    title="HOSPITAL"
                    value={hospitalStatus || "PENDING"}
                    color="text-emerald-400"
                  />

                  <StatusBox
                    title="AMBULANCE"
                    value={
                      assignedAmbulance
                        ? "DISPATCHED"
                        : "PENDING"
                    }
                    color="text-yellow-400"
                  />

                  <StatusBox
                    title="COORDINATION"
                    value={
                      isAmbulanceDispatched
                        ? "ACTIVE"
                        : "PENDING"
                    }
                    color="text-cyan-400"
                  />
                </div>
              </div>
            </section>

            {/* RESPONSE STATUS */}

            <section className="bg-[#0b1220] border border-slate-800 rounded-lg p-4">

              <div className="flex items-center gap-2 mb-4">

                <Activity className="w-4 h-4 text-cyan-400" />

                <div>
                  <h2 className="text-xs font-bold text-white">
                    RESPONSE STATUS
                  </h2>

                  <p className="text-[7px] text-slate-600 font-mono">
                    LIVE UNIT TELEMETRY
                  </p>
                </div>
              </div>

              <div className="space-y-2">

                <ResponseRow
                  label="POLICE CAD"
                  value={policeStateLabel}
                  valueClass={
                    isAmbulanceDispatched
                      ? "text-emerald-400"
                      : "text-yellow-400"
                  }
                />

                <ResponseRow
                  label="AMBULANCE UNIT"
                  value={
                    assignedAmbulance?.ambulanceId ||
                    "TN-108-ALS-04"
                  }
                  valueClass="text-emerald-400"
                />

                <ResponseRow
                  label="ETA"
                  value={ambulanceEta}
                  valueClass="text-cyan-400"
                />

                <ResponseRow
                  label="CURRENT LOCATION"
                  value={
                    safeAmbulanceTracking.currentLocation ||
                    "Hospital Dispatch Gate"
                  }
                  valueClass="text-slate-300"
                />
              </div>

              {isAmbulanceDispatched && (
                <div className="mt-4">

                  <div className="flex justify-between mb-2">

                    <span className="text-[7px] text-slate-600">
                      TRANSIT PROGRESS
                    </span>

                    <span className="text-[7px] text-emerald-400 font-bold">
                      {safeAmbulanceTracking.progressPercent || 0}%
                    </span>
                  </div>

                  <div className="h-1.5 rounded-full bg-slate-900 overflow-hidden">

                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                      style={{
                        width: `${
                          safeAmbulanceTracking.progressPercent || 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </section>

            {/* RESPONSE RESOURCE */}

            <section className="bg-[#0b1220] border border-slate-800 rounded-lg overflow-hidden">

              <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-2">

                <Hospital className="w-4 h-4 text-emerald-400" />

                <div>
                  <h2 className="text-xs font-bold text-white">
                    RESPONSE RESOURCES
                  </h2>

                  <p className="text-[7px] text-slate-600 font-mono">
                    RECOMMENDED MEDICAL FACILITY
                  </p>
                </div>
              </div>

              <div className="p-4">

                {selectedHospital ? (
                  <div className="rounded-md bg-slate-950 border border-slate-800 p-3">

                    <div className="flex items-start justify-between">

                      <div className="flex gap-2">

                        <Hospital className="w-4 h-4 text-emerald-400 mt-0.5" />

                        <div>

                          <p className="text-[10px] font-bold text-white">
                            {selectedHospital.name}
                          </p>

                          <p className="text-[7px] text-slate-600 mt-1">
                            {selectedHospital.city || "Chennai"}
                          </p>
                        </div>
                      </div>

                      <span className="text-[7px] text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 px-1.5 py-1 rounded">
                        SUITABLE
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-3">

                      <SmallResource
                        label="DISTANCE"
                        value={`${selectedHospital.distanceKm || 2.1} km`}
                      />

                      <SmallResource
                        label="ER BEDS"
                        value={
                          selectedHospital.emergencyBeds || 11
                        }
                      />

                      <SmallResource
                        label="ICU BEDS"
                        value={
                          selectedHospital.icuBeds || 4
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-[9px] text-slate-600 py-4">
                    SEARCHING MEDICAL FACILITY...
                  </p>
                )}

                {assignedAmbulance && (
                  <div className="mt-3 rounded-md bg-slate-950 border border-slate-800 p-3 flex items-center gap-2">

                    <Ambulance className="w-4 h-4 text-yellow-400" />

                    <div>
                      <p className="text-[9px] font-bold text-white">
                        {assignedAmbulance.ambulanceId}
                      </p>

                      <p className="text-[7px] text-slate-600">
                        {assignedAmbulance.ambulanceType ||
                          "ALS AMBULANCE"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* TIMELINE */}

            <section className="bg-[#0b1220] border border-slate-800 rounded-lg p-4">

              <div className="flex items-center gap-2 mb-4">

                <Clock className="w-4 h-4 text-violet-400" />

                <h2 className="text-xs font-bold text-white">
                  INCIDENT TIMELINE
                </h2>
              </div>

              <div className="space-y-4">

                <TimelineItem
                  time={formatTime(incidentTimestamp)}
                  title="AI INCIDENT DETECTED"
                  detail="Collision detected by road camera AI."
                  active
                />

                <TimelineItem
                  time="T+00:30"
                  title="POLICE CONTROL ROOM ALERTED"
                  detail="Incident forwarded to police CAD."
                />

                <TimelineItem
                  time="T+01:00"
                  title="HOSPITAL IDENTIFIED"
                  detail={
                    selectedHospital?.name ||
                    "Suitable hospital identified."
                  }
                />

                <TimelineItem
                  time={
                    isAmbulanceDispatched
                      ? "ACTIVE"
                      : "PENDING"
                  }
                  title="EMERGENCY RESPONSE"
                  detail={
                    isAmbulanceDispatched
                      ? "Police and ambulance response active."
                      : "Awaiting dispatch acknowledgement."
                  }
                />
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* ========================================================
          INCOMING EMERGENCY POPUP
      ======================================================== */}

      {showIncomingPopup && (
        <div className="fixed bottom-5 left-5 z-[100] w-[min(560px,calc(100vw-40px))]">

          <div className="rounded-2xl border border-red-500/60 bg-[#080d17]/[97%] backdrop-blur-xl shadow-2xl shadow-red-950/60 overflow-hidden">

            {/* TOP ALERT LINE */}

            <div className="h-1 bg-gradient-to-r from-red-600 via-red-400 to-transparent" />

            {/* HEADER */}

            <div className="px-5 py-4 border-b border-red-500/10 bg-red-500/5">

              <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">

                  <div className="relative w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">

                    <Radio className="w-5 h-5 text-red-400 animate-pulse" />

                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                  </div>

                  <div>

                    <div className="flex items-center gap-2">

                      <span className="text-[9px] text-red-400 font-bold font-mono tracking-widest">
                        INCOMING EMERGENCY
                      </span>

                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    </div>

                    <h2 className="text-base font-black text-white mt-1">
                      CATASTROPHIC COLLISION
                    </h2>

                    <p className="text-[9px] text-slate-500 font-mono mt-0.5">
                      AI INCIDENT ALERT // POLICE CAD
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowIncomingPopup(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* INCIDENT INFORMATION */}

            <div className="p-5">

              {/* LOCATION */}

              <div className="flex items-center gap-2 mb-4">

                <MapPin className="w-4 h-4 text-yellow-400" />

                <div>

                  <p className="text-[7px] text-slate-600 font-mono">
                    ACCIDENT LOCATION
                  </p>

                  <p className="text-[11px] font-bold text-yellow-300 mt-0.5">
                    {accidentLocation}
                  </p>
                </div>
              </div>

              {/* INFO GRID */}

              <div className="grid grid-cols-2 gap-3">

                <PopupInfo
                  label="INCIDENT ID"
                  value={incidentId}
                  valueClass="text-cyan-300"
                />

                <PopupInfo
                  label="SEVERITY"
                  value={severityLevel}
                  valueClass="text-red-400"
                />

                <PopupInfo
                  label="DATE / TIME"
                  value={formatTime(incidentTimestamp)}
                />

                <PopupInfo
                  label="RISK SCORE"
                  value={`${riskScore}%`}
                  valueClass="text-red-400"
                />
              </div>

              {/* REPORT */}

              <div className="mt-4 rounded-xl bg-slate-950 border border-slate-800 p-3">

                <div className="flex items-center gap-2 mb-2">

                  <FileText className="w-3.5 h-3.5 text-cyan-400" />

                  <span className="text-[8px] font-bold text-cyan-400 font-mono">
                    AI INCIDENT REPORT
                  </span>
                </div>

                <p className="text-[9px] text-slate-400 leading-relaxed">
                  {incidentDescription}
                </p>

                <div className="grid grid-cols-3 gap-3 mt-3">

                  <div>
                    <p className="text-[7px] text-slate-600">
                      VEHICLE A
                    </p>

                    <p className="text-[8px] text-slate-300 font-bold mt-1">
                      {activeIncident?.vehicleA?.type ||
                        "Heavy Vehicle"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[7px] text-slate-600">
                      VEHICLE B
                    </p>

                    <p className="text-[8px] text-slate-300 font-bold mt-1">
                      {activeIncident?.vehicleB?.type ||
                        "Passenger Sedan"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[7px] text-slate-600">
                      IMPACT
                    </p>

                    <p className="text-[8px] text-yellow-400 font-bold mt-1">
                      {activeIncident?.impactSpeedKmH || 48} km/h
                    </p>
                  </div>
                </div>
              </div>

              {/* HOSPITAL SUMMARY */}

              <div className="mt-3 rounded-xl bg-emerald-500/5 border border-emerald-500/25 p-3">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2 min-w-0">

                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">

                      <Hospital className="w-4 h-4 text-emerald-400" />
                    </div>

                    <div className="min-w-0">

                      <p className="text-[7px] text-emerald-400 font-bold font-mono">
                        NEAREST MEDICAL FACILITY
                      </p>

                      <p className="text-[9px] text-white font-bold truncate mt-1">
                        {selectedHospital?.name ||
                          "Metro Trauma Hospital"}
                      </p>

                      <p className="text-[7px] text-slate-500 mt-0.5">
                        ~{selectedHospital?.distanceKm || 2.1} km
                      </p>
                    </div>
                  </div>

                  <div className="text-right">

                    <p className="text-[8px] text-emerald-300 font-bold">
                      {selectedHospital?.emergencyBeds || 11} ER
                    </p>

                    <p className="text-[8px] text-emerald-300 font-bold mt-1">
                      {selectedHospital?.icuBeds || 4} ICU
                    </p>
                  </div>
                </div>
              </div>

              {/* ==================================================
                  ACTION BUTTONS
                  ================================================== */}

              <div className="grid grid-cols-2 gap-3 mt-4">

                {/* VIEW HOSPITAL LIST
                    ONLY NAVIGATES TO HOSPITAL DASHBOARD */}

                <button
                  type="button"
                  onClick={handleViewHospitalList}
                  className="h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/40 hover:bg-cyan-500/20 text-cyan-300 text-[9px] font-black tracking-wide flex items-center justify-center gap-2 transition"
                >
                  <Hospital className="w-4 h-4" />

                  VIEW HOSPITAL LIST

                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {/* ACKNOWLEDGE + DISPATCH */}

                <button
                  type="button"
                  onClick={handleAcknowledgeAndDispatch}
                  className="h-12 rounded-xl bg-red-600 hover:bg-red-500 text-white text-[9px] font-black tracking-wide flex items-center justify-center gap-2 transition shadow-lg shadow-red-950/40"
                >
                  <CheckCircle2 className="w-4 h-4" />

                  ACKNOWLEDGE & DISPATCH

                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          REOPEN ALERT
      ======================================================== */}

      {!showIncomingPopup && (
        <button
          type="button"
          onClick={() => setShowIncomingPopup(true)}
          className="fixed bottom-5 left-5 z-[100] flex items-center gap-2 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-950/50 text-[9px] font-bold animate-pulse"
        >
          <Radio className="w-4 h-4" />
          VIEW INCOMING EMERGENCY
        </button>
      )}
    </div>
  );
}

/* ============================================================
   METRIC CARD
   ============================================================ */

function MetricCard({
  icon,
  title,
  value,
  valueClass,
}) {
  return (
    <div className="bg-[#101928] p-4">

      <div className="flex items-center gap-2 text-slate-500">

        {icon}

        <span className="text-[8px] font-bold tracking-wider">
          {title}
        </span>
      </div>

      <p className={`text-2xl font-black mt-2 ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   MAP MARKER
   ============================================================ */

function MapMarker({
  type,
  label,
  position,
  className,
}) {
  return (
    <div
      className={`absolute ${position} flex flex-col items-center`}
    >
      <div
        className={`w-8 h-8 rounded-full ${className} border-2 border-white shadow-lg flex items-center justify-center`}
      >
        <span className="text-[9px] font-black text-white">
          {type}
        </span>
      </div>

      <span className="mt-1 px-1.5 py-0.5 rounded bg-black/80 text-[6px] text-slate-400 font-mono">
        {label}
      </span>
    </div>
  );
}

/* ============================================================
   LEGEND
   ============================================================ */

function LegendItem({
  color,
  text,
}) {
  return (
    <div className="flex items-center gap-1.5">

      <span className={`w-1.5 h-1.5 rounded-full ${color}`} />

      <span className="text-[7px] text-slate-500">
        {text}
      </span>
    </div>
  );
}

/* ============================================================
   SOURCE BADGE
   ============================================================ */

function SourceBadge({ children }) {
  return (
    <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[7px] text-slate-400 font-mono">
      {children}
    </span>
  );
}

/* ============================================================
   STATUS BOX
   ============================================================ */

function StatusBox({
  title,
  value,
  color,
}) {
  return (
    <div className="rounded-md bg-slate-950 border border-slate-800 p-2.5">

      <p className="text-[7px] text-slate-600 uppercase">
        {title}
      </p>

      <p
        className={`text-[8px] font-bold mt-1 uppercase truncate ${color}`}
      >
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   RESPONSE ROW
   ============================================================ */

function ResponseRow({
  label,
  value,
  valueClass,
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-800 last:border-b-0">

      <span className="text-[8px] text-slate-600">
        {label}
      </span>

      <span
        className={`text-[8px] font-bold font-mono text-right max-w-[180px] truncate ${valueClass}`}
      >
        {value}
      </span>
    </div>
  );
}

/* ============================================================
   SMALL RESOURCE
   ============================================================ */

function SmallResource({
  label,
  value,
}) {
  return (
    <div>

      <p className="text-[6px] text-slate-600 uppercase">
        {label}
      </p>

      <p className="text-[9px] font-bold text-slate-300 mt-1">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   POPUP INFO
   ============================================================ */

function PopupInfo({
  label,
  value,
  valueClass = "text-slate-200",
}) {
  return (
    <div>

      <span className="text-[7px] text-slate-600 font-mono">
        {label}
      </span>

      <p
        className={`text-[9px] font-bold font-mono mt-1 ${valueClass}`}
      >
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   TIMELINE
   ============================================================ */

function TimelineItem({
  time,
  title,
  detail,
  active = false,
}) {
  return (
    <div className="relative pl-5">

      <div
        className={`absolute left-0 top-1.5 w-2 h-2 rounded-full ${
          active
            ? "bg-red-400 shadow-lg shadow-red-500/50"
            : "bg-slate-700"
        }`}
      />

      <div className="absolute left-[3px] top-4 bottom-[-18px] w-px bg-slate-800" />

      <p className="text-[7px] text-slate-600 font-mono">
        {time}
      </p>

      <p className="text-[8px] font-bold text-slate-300 mt-1">
        {title}
      </p>

      <p className="text-[7px] text-slate-600 mt-0.5">
        {detail}
      </p>
    </div>
  );
}