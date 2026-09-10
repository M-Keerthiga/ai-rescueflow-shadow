import React, { useState } from 'react';
import {
  Hospital,
  AlertTriangle,
  Ambulance,
  MapPin,
  Clock,
  Bed,
  CheckCircle2,
  Radio,
  FileText,
  Activity,
  ArrowLeft,
  Navigation,
  Shield,
  HeartPulse,
  Users,
  Gauge
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { SIMULATION_DISCLAIMER } from '../services/hospitalService.js';

export default function HospitalDashboard() {
  const navigate = useNavigate();
  const {
    activeIncident,
    assignedHospital,
    assignedAmbulance,
    ambulanceTracking,
    hospitalStatus,
    acceptHospitalEmergency
  } = useApp();

  const [notificationDismissed, setNotificationDismissed] = useState(false);

  // Derive hospital & incident details with clean fallbacks
  const hospital = assignedHospital || {
    id: 'HOSP-ORR-01',
    name: 'Sri Ramachandra Medical Centre (SRMC)',
    address: 'No 1 Ramachandra Nagar, Porur, Chennai, Tamil Nadu 600116',
    city: 'Chennai',
    distanceKm: 2.4,
    etaMinutes: 4,
    emergencyBeds: 18,
    icuBeds: 8,
    traumaLevel: 'LEVEL_1_TRAUMA',
    phone: '+91-44-4592-8500'
  };

  const incident = activeIncident || {
    id: 'INC-TN-849201',
    incidentId: 'INC-TN-849201',
    timestamp: new Date().toISOString(),
    location: 'Chennai Outer Ring Road',
    severityLevel: 'CRITICAL',
    severityScore: 92,
    impactSpeedKmH: 58,
    vehicleA: { type: 'HEAVY TRUCK #02', speed: 58 },
    vehicleB: { type: 'SEDAN #15', speed: 28 }
  };

  const accidentLocation = incident.location || incident.telemetry?.location || 'Chennai Outer Ring Road';
  const ambulanceId = assignedAmbulance?.ambulanceId || hospital.ambulanceFleet?.[0] || 'TN-108-ALS-04';
  const isDispatched = hospitalStatus === 'AMBULANCE_DISPATCHED' || hospitalStatus === 'ARRIVED_AT_SCENE' || ambulanceTracking.status === 'EN_ROUTE';

  const waypoints = hospital.waypoints || [
    { name: 'Hospital Emergency Bay', progress: 0 },
    { name: 'Arterial Corridor Expressway', progress: 30 },
    { name: 'Flyover Interchange Point', progress: 65 },
    { name: `Accident Scene (${accidentLocation})`, progress: 100 }
  ];

  const handleAcceptRequest = () => {
    acceptHospitalEmergency();
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Permanent Simulation Disclaimer Banner */}
      <div className="bg-amber-500/15 border border-amber-500/40 p-3 rounded-xl flex items-center justify-between flex-wrap gap-2 text-amber-300 font-mono text-xs font-bold shadow-md">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="uppercase tracking-wider">{SIMULATION_DISCLAIMER}</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
          HOSPITAL TRAUMA INTAKE SIMULATION
        </span>
      </div>

      {/* Main Header */}
      <div className="bg-navy-900 border border-slate-800 p-5 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Hospital className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
              EMERGENCY MEDICAL ADMISSIONS & TRAUMA RESPONSE
            </span>
            <h1 className="text-xl font-bold text-slate-100 font-mono tracking-tight">
              {hospital.name}
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              {hospital.address} | Emergency Hotline: {hospital.phone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/police-dashboard')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-mono text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            Police Dashboard
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INCOMING EMERGENCY NOTIFICATION BANNER */}
      {/* ========================================================================= */}
      {!notificationDismissed && (
        <div className="bg-red-500/15 border-2 border-red-500/70 p-4 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-4 font-mono text-xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 animate-pulse">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-red-400 uppercase text-xs">
                  INCOMING EMERGENCY DISPATCH REQUEST RECEIVED
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 font-bold">
                  {incident.id || incident.incidentId}
                </span>
              </div>
              <p className="text-slate-200 mt-0.5 text-[11px]">
                High-priority trauma request from Metropolitan Police for collision at <strong>{accidentLocation}</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isDispatched ? (
              <button
                onClick={handleAcceptRequest}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all text-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Accept Emergency & Dispatch Ambulance</span>
              </button>
            ) : (
              <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40 text-xs">
                ✓ Request Accepted & Dispatched
              </span>
            )}

            <button
              onClick={() => setNotificationDismissed(true)}
              className="text-slate-500 hover:text-slate-300 p-1.5"
              title="Dismiss Alert"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Top 4 Key Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="bg-navy-900 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <span className="text-slate-500 block text-[10px] uppercase">Available Emergency Beds</span>
          <div className="flex items-center gap-2">
            <Bed className="w-4 h-4 text-emerald-400" />
            <span className="text-xl font-bold text-emerald-400">{hospital.emergencyBeds} Beds</span>
          </div>
          <span className="text-[10px] text-slate-400 block">Triage Bays Reserved: 2</span>
        </div>

        <div className="bg-navy-900 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <span className="text-slate-500 block text-[10px] uppercase">Available ICU Beds</span>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            <span className="text-xl font-bold text-indigo-300">{hospital.icuBeds} Beds</span>
          </div>
          <span className="text-[10px] text-slate-400 block">Ventilator Ready: Verified</span>
        </div>

        <div className="bg-navy-900 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <span className="text-slate-500 block text-[10px] uppercase">Assigned Ambulance</span>
          <div className="flex items-center gap-2">
            <Ambulance className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-bold text-amber-300 truncate">{ambulanceId}</span>
          </div>
          <span className="text-[10px] text-slate-400 block">ALS Intensive Trauma Care</span>
        </div>

        <div className="bg-navy-900 border border-slate-800 p-3.5 rounded-xl space-y-1">
          <span className="text-slate-500 block text-[10px] uppercase">Estimated Travel Time</span>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-xl font-bold text-cyan-300">
              {ambulanceTracking.status === 'ARRIVED_AT_SCENE'
                ? 'Arrived'
                : `${ambulanceTracking.etaMinutes || hospital.etaMinutes} mins`}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block">Distance: {hospital.distanceKm} km</span>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Route Map & Live Ambulance Tracking (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Route Map Visualizer */}
          <div className="bg-navy-900 border border-slate-800 rounded-2xl p-5 shadow-md space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-cyan-400" />
                <h2 className="font-bold text-slate-100 uppercase tracking-wider text-xs">
                  ROUTE MAP: HOSPITAL TO ACCIDENT LOCATION
                </h2>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                isDispatched
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 animate-pulse'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              }`}>
                ● {isDispatched ? 'AMBULANCE EN ROUTE' : 'DISPATCH PENDING'}
              </span>
            </div>

            {/* Futuristic SVG Route Visualizer */}
            <div className="relative bg-slate-950 rounded-xl p-4 border border-slate-800 overflow-hidden">
              <svg viewBox="0 0 600 200" className="w-full h-48 select-none">
                {/* Background Grid */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                  </pattern>
                  <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#ef4444" />
                  </linearGradient>
                </defs>
                <rect width="600" height="200" fill="url(#grid)" />

                {/* Main Route Polyline */}
                <path
                  d="M 60 100 Q 180 40 300 110 T 540 100"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M 60 100 Q 180 40 300 110 T 540 100"
                  fill="none"
                  stroke="url(#routeGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="6 4"
                />

                {/* Waypoint Markers */}
                <circle cx="60" cy="100" r="10" fill="#10b981" className="animate-pulse" />
                <circle cx="60" cy="100" r="16" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.6" />
                <text x="40" y="130" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  HOSPITAL BASE
                </text>
                <text x="35" y="145" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                  {hospital.name.slice(0, 20)}...
                </text>

                <circle cx="300" cy="110" r="6" fill="#06b6d4" />
                <text x="260" y="135" fill="#06b6d4" fontSize="9" fontFamily="monospace">
                  WAYPOINT 2 (EXPRESSWAY)
                </text>

                <circle cx="540" cy="100" r="10" fill="#ef4444" className="animate-pulse" />
                <circle cx="540" cy="100" r="18" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.6" />
                <text x="490" y="130" fill="#ef4444" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  ACCIDENT SCENE
                </text>
                <text x="480" y="145" fill="#cbd5e1" fontSize="8" fontFamily="monospace">
                  {accidentLocation.slice(0, 24)}
                </text>

                {/* Live Ambulance Marker positioned along the curve */}
                {(() => {
                  const p = (ambulanceTracking.progressPercent || 0) / 100;
                  // Bezier interpolation approximation
                  const t = Math.max(0, Math.min(1, p));
                  const x = 60 + t * (540 - 60);
                  const y = 100 + Math.sin(t * Math.PI * 2) * 20;

                  return (
                    <g transform={`translate(${x}, ${y})`}>
                      <circle r="14" fill="#06b6d4" opacity="0.3" className="animate-ping" />
                      <circle r="8" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" />
                      <text x="-15" y="-14" fill="#38bdf8" fontSize="9" fontWeight="bold" fontFamily="monospace">
                        AMBULANCE ({ambulanceTracking.progressPercent}%)
                      </text>
                    </g>
                  );
                })()}
              </svg>

              {/* Real-Time Live Telemetry HUD */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-800 text-[10px]">
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <span className="text-slate-500 block">STATUS:</span>
                  <span className="text-emerald-400 font-bold">
                    {ambulanceTracking.status === 'ARRIVED_AT_SCENE' ? 'ARRIVED ON SCENE' : ambulanceTracking.status}
                  </span>
                </div>
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <span className="text-slate-500 block">CURRENT SPEED:</span>
                  <span className="text-cyan-400 font-bold">
                    {ambulanceTracking.speedKmH ? `${ambulanceTracking.speedKmH} km/h` : '0 km/h'}
                  </span>
                </div>
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <span className="text-slate-500 block">EST. REMAINING:</span>
                  <span className="text-amber-400 font-bold">
                    {ambulanceTracking.etaMinutes ? `${ambulanceTracking.etaMinutes} mins` : `${hospital.etaMinutes} mins`}
                  </span>
                </div>
                <div className="bg-slate-900 p-2 rounded border border-slate-800">
                  <span className="text-slate-500 block">PROGRESS:</span>
                  <span className="text-indigo-300 font-bold">{ambulanceTracking.progressPercent}%</span>
                </div>
              </div>
            </div>

            {/* Waypoint Milestones Progression */}
            <div className="space-y-2 pt-1">
              <span className="text-slate-400 text-[11px] font-bold block">
                TRANSIT WAYPOINTS & MILESTONES:
              </span>
              <div className="space-y-1.5">
                {waypoints.map((wp, idx) => {
                  const isPassed = (ambulanceTracking.progressPercent || 0) >= wp.progress;
                  const isCurrent =
                    (ambulanceTracking.progressPercent || 0) >= wp.progress - 15 &&
                    (ambulanceTracking.progressPercent || 0) <= wp.progress + 15;

                  return (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border flex items-center justify-between text-[11px] transition-all ${
                        isCurrent
                          ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 font-bold'
                          : isPassed
                          ? 'bg-slate-950/80 border-slate-800 text-slate-300'
                          : 'bg-slate-950/40 border-slate-900 text-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isPassed ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                        <span>{idx + 1}. {wp.name}</span>
                      </div>
                      <span className="text-[10px] font-bold">
                        {isPassed ? 'PASSED' : `${wp.progress}% TARGET`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Dispatch Button */}
            {!isDispatched ? (
              <button
                onClick={handleAcceptRequest}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all text-xs"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ACCEPT REQUEST & DISPATCH AMBULANCE NOW</span>
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-center text-emerald-300 font-bold text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>AMBULANCE DISPATCHED & EN ROUTE — POLICE DASHBOARD SYNCED</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Assigned Incident, Report & Patient Response Status (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Assigned Incident Card */}
          <div className="bg-navy-900 border border-slate-800 rounded-2xl p-5 shadow-md space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-slate-100 uppercase text-xs">
                  ASSIGNED EMERGENCY INCIDENT
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold text-[10px] border border-red-500/30 uppercase">
                {incident.severityLevel || 'CRITICAL'}
              </span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">INCIDENT ID:</span>
                <span className="text-slate-200 font-bold">{incident.id || incident.incidentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ACCIDENT LOCATION:</span>
                <span className="text-amber-300 font-bold truncate max-w-[200px]">{accidentLocation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">COLLISION RISK:</span>
                <span className="text-red-400 font-bold">{incident.severityScore || 92}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">IMPACT VELOCITY:</span>
                <span className="text-slate-200 font-bold">{incident.impactSpeedKmH || 48} km/h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">VEHICLES INVOLVED:</span>
                <span className="text-slate-200">
                  {incident.vehicleA?.type || 'Bus'} × {incident.vehicleB?.type || 'Car'}
                </span>
              </div>
            </div>

            {/* Generated Incident Report Snippet */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-1 text-[11px]">
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Generated Audit Telemetry:</span>
              <p className="text-slate-300 leading-relaxed font-sans">
                {incident.severity?.description ||
                  `Critical intersection collision confirmed. Automated trauma triage initiated with Level 1 trauma alert for ${hospital.name}.`}
              </p>
            </div>
          </div>

          {/* Patient Response & ER Triage Status */}
          <div className="bg-navy-900 border border-slate-800 rounded-2xl p-5 shadow-md space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <HeartPulse className="w-4 h-4 text-rose-400" />
              <h3 className="font-bold text-slate-100 uppercase text-xs">
                PATIENT RESPONSE & HOSPITAL READINESS
              </h3>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-200 font-bold block">Trauma ER Bay Reserved</span>
                  <span className="text-[10px] text-slate-500">Emergency Resuscitation Bay #02</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                  RESERVED
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-200 font-bold block">On-Call Surgical Trauma Team</span>
                  <span className="text-[10px] text-slate-500">Vascular & Orthopedic On Standby</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                  ALERTED
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-200 font-bold block">Blood Bank Reserve</span>
                  <span className="text-[10px] text-slate-500">O-Negative Units Cross-Matched</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px] border border-emerald-500/30">
                  READY
                </span>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-200 font-bold block">ALS Crew Communication Link</span>
                  <span className="text-[10px] text-slate-500">Direct VHF Emergency Radio CH-9</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold text-[10px] border border-cyan-500/30">
                  ACTIVE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
