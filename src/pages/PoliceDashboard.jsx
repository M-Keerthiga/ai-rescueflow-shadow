import React, { useState, useEffect } from 'react';
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
  Phone,
  FileText,
  Bed,
  Activity,
  Layers,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import {
  getHospitalsForLocation,
  selectNearestSuitableHospital,
  SIMULATION_DISCLAIMER
} from '../services/hospitalService.js';

export default function PoliceDashboard() {
  const navigate = useNavigate();
  const {
    activeIncident,
    policeStatus,
    hospitalStatus,
    assignedHospital,
    assignedAmbulance,
    ambulanceTracking,
    acknowledgePoliceIncident
  } = useApp();

  // Accident Location
  const accidentLocation = activeIncident?.location || activeIncident?.telemetry?.location || 'Chennai Outer Ring Road';

  // Retrieve hospitals ranked strictly by:
  // 1. Distance from accident
  // 2. Emergency bed availability
  // 3. ICU bed availability
  const [recommendedHospitals, setRecommendedHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [showIncomingPopup, setShowIncomingPopup] = useState(true);

  useEffect(() => {
    const hospitals = getHospitalsForLocation(accidentLocation);
    setRecommendedHospitals(hospitals);
    // Automatically select the nearest suitable hospital
    if (!selectedHospital && hospitals.length > 0) {
      setSelectedHospital(assignedHospital || hospitals[0]);
    }
  }, [accidentLocation, assignedHospital]);

  // Handle police operator acknowledging incident & requesting hospital dispatch
  const handleAcknowledgeAndDispatch = () => {
    const targetHosp = selectedHospital || recommendedHospitals[0];
    acknowledgePoliceIncident(targetHosp);
    setShowIncomingPopup(false);
    // Navigate to /hospital-dashboard as requested
    navigate('/hospital-dashboard');
  };

  const incidentId = activeIncident?.id || activeIncident?.incidentId || 'INC-TN-849201';
  const incidentTimestamp = activeIncident?.timestamp
    ? new Date(activeIncident.timestamp).toLocaleString()
    : new Date().toLocaleString();
  const severityLevel = activeIncident?.severityLevel || activeIncident?.severity?.level || 'CRITICAL';
  const riskScore = activeIncident?.severityScore || activeIncident?.telemetry?.riskAtCollision || 88;

  const isAmbulanceDispatched = policeStatus === 'EN_ROUTE' || policeStatus === 'AMBULANCE_DISPATCHED' || policeStatus === 'PATROL_AT_SCENE';

  return (
    <div className="space-y-6 font-sans">
      {/* Permanent Simulation Disclaimer Banner */}
      <div className="bg-amber-500/15 border border-amber-500/40 p-3 rounded-xl flex items-center justify-between flex-wrap gap-2 text-amber-300 font-mono text-xs font-bold shadow-md">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span className="uppercase tracking-wider">{SIMULATION_DISCLAIMER}</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">
          POLICE CAD SIMULATION DISPATCH
        </span>
      </div>

      {/* Main Header */}
      <div className="bg-navy-900 border border-slate-800 p-5 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100 font-mono tracking-tight">
                METROPOLITAN POLICE TRAFFIC & EMERGENCY COMMAND
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                CAD Interceptor Dispatch, Corridor Lockdown & Hospital Emergency Coordination
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/rescue/analysis')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Incident Analysis
          </button>

          <button
            onClick={() => setShowIncomingPopup(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-300 border border-indigo-500/40 font-mono text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
            View Incoming Emergency Alert
          </button>
        </div>
      </div>

      {/* Real-time Status Card (Updated in Real-Time when Ambulance is Dispatched) */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 font-mono text-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Radio className={`w-4 h-4 ${isAmbulanceDispatched ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
            <span className="font-bold text-slate-100 uppercase tracking-wider">
              REAL-TIME CAD POLICE DISPATCH LOG
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-slate-500">INCIDENT STATE:</span>
            <span className={`px-2.5 py-0.5 rounded-full font-bold border ${
              isAmbulanceDispatched
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
            }`}>
              ● {policeStatus === 'EN_ROUTE' ? 'EN ROUTE TO SCENE' : policeStatus}
            </span>
          </div>
        </div>

        {/* 4 Real-time Police Telemetry Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-navy-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 block text-[10px] uppercase">Hospital Assigned</span>
            <span className="font-bold text-slate-100 text-sm truncate block" title={assignedHospital?.name || selectedHospital?.name}>
              {assignedHospital?.name || selectedHospital?.name || 'Awaiting Selection'}
            </span>
            <span className="text-[10px] text-indigo-300 block">
              Level 1 Trauma Facility
            </span>
          </div>

          <div className="bg-navy-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 block text-[10px] uppercase">Ambulance Dispatched</span>
            <span className="font-bold text-amber-400 text-sm block">
              {assignedAmbulance?.ambulanceId || 'TN-108-ALS-04'}
            </span>
            <span className="text-[10px] text-slate-400 block">
              {assignedAmbulance?.ambulanceType || 'ALS Intensive Extrication'}
            </span>
          </div>

          <div className="bg-navy-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 block text-[10px] uppercase">Estimated Arrival Time</span>
            <span className="font-bold text-cyan-400 text-sm block">
              {ambulanceTracking.status === 'ARRIVED_AT_SCENE'
                ? '0.0 min (ON SCENE)'
                : `${ambulanceTracking.etaMinutes || (selectedHospital?.etaMinutes ?? 3.5)} mins`}
            </span>
            <span className="text-[10px] text-slate-400 block">
              Speed: {ambulanceTracking.speedKmH ? `${ambulanceTracking.speedKmH} km/h` : 'Standby'}
            </span>
          </div>

          <div className="bg-navy-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
            <span className="text-slate-500 block text-[10px] uppercase">Ambulance Current Location</span>
            <span className="font-bold text-emerald-400 text-xs truncate block" title={ambulanceTracking.currentLocation}>
              {ambulanceTracking.currentLocation || 'Hospital Dispatch Gate'}
            </span>
            <span className="text-[10px] text-slate-400 block">
              Transit Progress: {ambulanceTracking.progressPercent}%
            </span>
          </div>
        </div>

        {/* Live Transit Progress Bar */}
        {isAmbulanceDispatched && (
          <div className="pt-2 space-y-1.5">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <Ambulance className="w-3.5 h-3.5 animate-bounce text-cyan-400" />
                Live En-Route Transit Tracking
              </span>
              <span className="font-bold text-emerald-400">
                {ambulanceTracking.progressPercent}% Complete — Dist Remaining: {ambulanceTracking.distanceRemainingKm} km
              </span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-400 h-full transition-all duration-700 ease-out"
                style={{ width: `${ambulanceTracking.progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Hospital Recommendation Section */}
      <div className="bg-navy-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-sm font-mono font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Hospital className="w-4 h-4 text-emerald-400" />
              RECOMMENDED HOSPITALS (ORDERED BY DISTANCE, ER BEDS & ICU BEDS)
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Accident Scene: <strong className="text-cyan-300">{accidentLocation}</strong>
            </p>
          </div>

          <div className="text-[10px] font-mono text-slate-400 flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Auto-Selected Nearest Suitable
            </span>
          </div>
        </div>

        {/* Ranked Hospital List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendedHospitals.map((hosp, idx) => {
            const isSelected = selectedHospital?.id === hosp.id;
            const isNearest = idx === 0;

            return (
              <div
                key={hosp.id}
                onClick={() => setSelectedHospital(hosp)}
                className={`p-4 rounded-xl border font-mono text-xs cursor-pointer transition-all space-y-3 relative ${
                  isSelected
                    ? 'bg-indigo-950/40 border-cyan-400 shadow-md ring-1 ring-cyan-400/50'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                {isNearest && (
                  <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[9px] uppercase tracking-wider shadow">
                    Nearest Suitable
                  </span>
                )}

                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-[10px] text-cyan-400 font-bold block">
                      RANK #{idx + 1}
                    </span>
                    <h3 className="font-bold text-slate-100 text-sm truncate" title={hosp.name}>
                      {hosp.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 truncate">{hosp.city}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-navy-950/70 p-2.5 rounded-lg border border-slate-800/80 text-[10px]">
                  <div>
                    <span className="text-slate-500 block">DISTANCE:</span>
                    <span className="font-bold text-amber-400">{hosp.distanceKm} km</span>
                    <span className="text-[9px] text-slate-500 block">~{hosp.etaMinutes} mins</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">ER BEDS:</span>
                    <span className="font-bold text-emerald-400 text-xs">{hosp.emergencyBeds} Avail</span>
                    <span className="text-[9px] text-slate-500 block">Triage Bay</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">ICU BEDS:</span>
                    <span className="font-bold text-indigo-300 text-xs">{hosp.icuBeds} Avail</span>
                    <span className="text-[9px] text-slate-500 block">Critical Bay</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/60">
                  <span className="text-slate-400 text-[10px]">Trauma Rating:</span>
                  <span className="text-cyan-300 font-bold text-[10px]">{hosp.traumaLevel}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dispatch Action Footer */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
          <div className="text-xs font-mono text-slate-300">
            Assigned Facility: <strong className="text-cyan-300">{selectedHospital?.name || 'Nearest Suitable Hospital'}</strong>
          </div>

          <button
            onClick={handleAcknowledgeAndDispatch}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-mono text-xs font-bold inline-flex items-center gap-2 shadow-lg shadow-emerald-950/50 transition-all active:scale-[0.99]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Acknowledge Incident & Request Hospital Dispatch →</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* INCOMING EMERGENCY INCIDENT POPUP MODAL */}
      {/* ========================================================================= */}
      {showIncomingPopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-navy-950 border-2 border-red-500/80 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl shadow-red-950/60 font-mono text-xs">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400 animate-pulse">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 font-bold text-[10px] border border-red-500/40">
                    URGENT CAD EMERGENCY INTAKE
                  </span>
                  <h2 className="text-base font-bold text-slate-100 mt-1">
                    NEW INCOMING COLLISION INCIDENT DETECTED
                  </h2>
                </div>
              </div>

              <button
                onClick={() => setShowIncomingPopup(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Incident Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block text-[10px]">INCIDENT ID:</span>
                <span className="font-bold text-cyan-300 text-sm">{incidentId}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">DATE & TIME:</span>
                <span className="font-bold text-slate-200 text-xs">{incidentTimestamp}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">COLLISION SEVERITY:</span>
                <span className="font-bold text-red-400 text-sm uppercase">{severityLevel}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 block text-[10px]">ACCIDENT LOCATION:</span>
                <span className="font-bold text-amber-300 text-xs flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  {accidentLocation}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">COLLISION RISK:</span>
                <span className="font-bold text-red-400 text-sm">{riskScore}%</span>
              </div>
            </div>

            {/* Generated Incident Report Summary */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/90 space-y-2">
              <div className="text-cyan-400 font-bold flex items-center gap-1.5 text-xs">
                <FileText className="w-4 h-4" />
                <span>GENERATED INCIDENT REPORT SUMMARY</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px] font-sans">
                {activeIncident?.severity?.description ||
                  `High-energy collision verified at ${accidentLocation}. Deterministic AI Shadow registered collision risk at ${riskScore}%. Severe vehicle deformation detected. Immediate ambulance dispatch, emergency triage bay reservation, and corridor lockdown initiated.`}
              </p>
              <div className="flex items-center gap-4 text-[10px] text-slate-400 pt-1">
                <span>Vehicle A: <strong className="text-slate-200">{activeIncident?.vehicleA?.type || 'Heavy Vehicle'}</strong></span>
                <span>Vehicle B: <strong className="text-slate-200">{activeIncident?.vehicleB?.type || 'Passenger Sedan'}</strong></span>
                <span>Impact Speed: <strong className="text-amber-400">{activeIncident?.impactSpeedKmH || 48} km/h</strong></span>
              </div>
            </div>

            {/* Auto-selected nearest hospital notification */}
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Hospital className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div>
                  <span className="text-emerald-400 font-bold block text-[11px]">
                    AUTO-IDENTIFIED NEAREST HOSPITAL:
                  </span>
                  <span className="text-slate-200 font-semibold text-xs">
                    {selectedHospital?.name || 'Metro Trauma Hospital'} (~{selectedHospital?.distanceKm || 2.1} km)
                  </span>
                </div>
              </div>
              <div className="text-right text-[10px] text-emerald-300 font-bold">
                <div>{selectedHospital?.emergencyBeds || 14} ER Beds Available</div>
                <div>{selectedHospital?.icuBeds || 6} ICU Beds Available</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowIncomingPopup(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
              >
                Review Hospital List
              </button>
              <button
                onClick={handleAcknowledgeAndDispatch}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-emerald-950/50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Acknowledge & Dispatch Nearest Hospital</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
