import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { calculateRisk } from '../../server/services/riskEngine.js';
import { soundManager } from '../components/common/AudioAlertPlayer.js';
import { INTERNAL_VIDEOS } from '../data/videoLibrary.js';
import {
  selectNearestSuitableHospital,
  createAmbulanceDispatchRequest,
  getHospitalsForLocation
} from '../services/hospitalService.js';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Vision Input & Controls State
  const [inputMode, setInputModeState] = useState('demo'); // demo, uploaded, webcam
  const [customVideoUrl, setCustomVideoUrl] = useState(INTERNAL_VIDEOS[0].sourceUrl);
  const [confidenceThresh, setConfidenceThresh] = useState(0.75);
  const [frameSampling, setFrameSampling] = useState(30);
  const [collisionThreshold, setCollisionThreshold] = useState(75); // Configured collision threshold (%)
  const [visionStatus, setVisionStatus] = useState({ modelStatus: 'DEMO_TELEMETRY', isTrained: false });
  const [selectedClipId, setSelectedClipId] = useState(INTERNAL_VIDEOS[0].clipId);
  const [videoSeekTime, setVideoSeekTime] = useState(0);

  // Uploaded Video State (isolated from dropdown library)
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [isPredictionRunning, setIsPredictionRunning] = useState(false);

  // Telemetry and Physical State
  const [vehicleA, setVehicleA] = useState(INTERNAL_VIDEOS[0].telemetry.vehicleA);
  const [vehicleB, setVehicleB] = useState(INTERNAL_VIDEOS[0].telemetry.vehicleB);
  const [environment, setEnvironment] = useState(INTERNAL_VIDEOS[0].telemetry.environment);

  // Risk & Emergency State
  const [riskResult, setRiskResult] = useState(null);
  const [activeIncident, setActiveIncident] = useState(null);
  const [incidentsList, setIncidentsList] = useState([]);
  const [alertsList, setAlertsList] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [liveVideoElement, setLiveVideoElement] = useState(null);

  // Multi-Agency Workflow States (Police, Hospital, Live Ambulance)
  const [policeStatus, setPoliceStatus] = useState('NEW_INCIDENT');
  const [hospitalStatus, setHospitalStatus] = useState('IDLE');
  const [assignedHospital, setAssignedHospital] = useState(null);
  const [assignedAmbulance, setAssignedAmbulance] = useState(null);
  const [ambulanceTracking, setAmbulanceTracking] = useState({
    status: 'STANDBY',
    progressPercent: 0,
    speedKmH: 0,
    etaMinutes: 0,
    distanceRemainingKm: 0,
    currentLocation: 'Hospital Emergency Bay',
    currentWaypointIndex: 0
  });

  const trackingTimerRef = useRef(null);

  // Check Vision API Status on startup
  useEffect(() => {
    fetch('/api/vision/status')
      .then((res) => res.json())
      .then((data) => setVisionStatus(data))
      .catch(() => setVisionStatus({ modelStatus: 'DEMO_TELEMETRY', isTrained: false }));
  }, []);

  // Selected clip data - internal library or active uploaded video
  const selectedClipData = inputMode === 'uploaded' && uploadedVideo
    ? uploadedVideo
    : INTERNAL_VIDEOS.find((c) => c.clipId === selectedClipId) || INTERNAL_VIDEOS[0];

  const setInputMode = (mode, url = null) => {
    setInputModeState(mode);
    if (url) setCustomVideoUrl(url);
  };

  // Recalculate Risk Function (API Primary + Deterministic Fallback)
  const recalculateRisk = useCallback(async (vA = vehicleA, vB = vehicleB, env = environment) => {
    try {
      const res = await fetch('/api/risk/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleA: vA, vehicleB: vB, environment: env })
      });

      if (res.ok) {
        const data = await res.json();
        setRiskResult(data);
        if (soundEnabled && (data.category === 'HIGH' || data.category === 'CRITICAL')) {
          soundManager.playDoubleCriticalAlert();
        }
        return data;
      }
    } catch (e) {
      console.warn('API unavailable, executing local deterministic engine calculation:', e);
    }

    const fallbackData = calculateRisk(vA, vB, env);
    setRiskResult(fallbackData);
    if (soundEnabled && (fallbackData.category === 'HIGH' || fallbackData.category === 'CRITICAL')) {
      soundManager.playDoubleCriticalAlert();
    }
    return fallbackData;
  }, [vehicleA, vehicleB, environment, soundEnabled]);

  useEffect(() => {
    recalculateRisk();
  }, [recalculateRisk]);

  const refreshData = useCallback(async () => {
    try {
      const [incRes, altRes, anaRes] = await Promise.all([
        fetch('/api/incidents'),
        fetch('/api/alerts'),
        fetch('/api/analytics')
      ]);

      if (incRes.ok) {
        const data = await incRes.json();
        setIncidentsList(data);
        if (data.length > 0 && !activeIncident) {
          setActiveIncident(data[0]);
        }
      }
      if (altRes.ok) setAlertsList(await altRes.json());
      if (anaRes.ok) setAnalyticsData(await anaRes.json());
    } catch (e) {
      console.warn('Failed to refresh data from backend:', e);
    }
  }, [activeIncident]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Clean up tracking timer on unmount
  useEffect(() => {
    return () => {
      if (trackingTimerRef.current) clearInterval(trackingTimerRef.current);
    };
  }, []);

  // Record Collision Incident via existing Backend API
  const triggerCollisionSimulation = async (customTelemetry) => {
    const loc = selectedClipData?.location || 'Chennai Outer Ring Road';
    const initialHospital = selectNearestSuitableHospital(loc);

    const payload = customTelemetry || {
      vehicleA,
      vehicleB,
      environment,
      riskAtCollision: riskResult?.predictedCollisionRisk || 92,
      location: loc
    };

    let enriched = null;

    try {
      const res = await fetch('/api/incidents/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const incident = await res.json();
        enriched = {
          ...incident,
          id: incident.incidentId || incident.id,
          location: loc,
          isCollision: true,
          isPrevention: false,
          reportReady: true,
          selectedHospital: initialHospital
        };
      }
    } catch (e) {
      console.error('Error recording collision incident:', e);
    }

    if (!enriched) {
      // Deterministic fallback if API fails
      enriched = {
        id: `INC-${Date.now().toString().slice(-6)}`,
        incidentId: `INC-${Date.now().toString().slice(-6)}`,
        timestamp: new Date().toISOString(),
        location: loc,
        status: 'ACTIVE_RESPONSE',
        isCollision: true,
        isPrevention: false,
        reportReady: true,
        severityLevel: 'CRITICAL',
        severityScore: payload.riskAtCollision || 88,
        severity: { level: 'CRITICAL', score: payload.riskAtCollision || 88, description: 'Critical collision conflict.' },
        impactSpeedKmH: 48,
        gForceB: 14.2,
        vehicleA: payload.vehicleA,
        vehicleB: payload.vehicleB,
        telemetry: payload,
        selectedHospital: initialHospital,
        dispatches: [
          { unitId: 'EMS-102', agency: initialHospital.name, type: 'Advanced Life Support Ambulance', status: 'DISPATCHED', etaMinutes: initialHospital.etaMinutes },
          { unitId: 'FIRE-04', agency: 'City Fire & Heavy Rescue Dept', type: 'Heavy Extrication Fire Tender', status: 'DISPATCHED', etaMinutes: 5 },
          { unitId: 'PATROL-P8', agency: 'Metropolitan Traffic Command', type: 'Highway Patrol Interceptor', status: 'DISPATCHED', etaMinutes: 3 }
        ],
        responseTimeline: [
          { stage: 'INCIDENT_DETECTED', label: 'Collision Impact Detected', duration: 110, status: 'COMPLETED' },
          { stage: 'SEVERITY_CALCULATED', label: 'Severity Classification Finalized', duration: 80, status: 'COMPLETED' },
          { stage: 'CAD_DISPATCH', label: 'Multi-Agency Emergency Dispatches Triggered', duration: 95, status: 'COMPLETED' },
          { stage: 'POLICE_RESPONSE_PLANNED', label: 'Police Corridor Lockdown Planned', duration: 75, status: 'COMPLETED' }
        ],
        preventionInsights: [
          { id: 'INS-01', category: 'INFRASTRUCTURE', title: 'Intersection Conflict Warning', recommendation: 'Extend yellow interval and activate geofenced speed limiters.', priority: 'HIGH' }
        ]
      };
    }

    // Set up initial workflow states
    setAssignedHospital(initialHospital);
    const initialAmbulance = createAmbulanceDispatchRequest(enriched, initialHospital);
    setAssignedAmbulance(initialAmbulance);
    setPoliceStatus('NEW_INCIDENT');
    setHospitalStatus('IDLE');
    setAmbulanceTracking({
      status: 'STANDBY',
      progressPercent: 0,
      speedKmH: 0,
      etaMinutes: initialHospital.etaMinutes,
      distanceRemainingKm: initialHospital.distanceKm,
      currentLocation: `${initialHospital.name} (Emergency Bay)`,
      currentWaypointIndex: 0
    });

    setActiveIncident(enriched);
    setIncidentsList((prev) => [enriched, ...prev]);
    return enriched;
  };

  /**
   * Internal Scenario Selection
   * Maps TN-001 -> s1.mp4, etc.
   */
  const selectVideoClip = useCallback((clipId) => {
    const clip = INTERNAL_VIDEOS.find((c) => c.clipId === clipId) || INTERNAL_VIDEOS[0];
    if (!clip) return;

    setSelectedClipId(clip.clipId);
    setInputModeState('demo');
    setCustomVideoUrl(clip.sourceUrl);
    setVideoSeekTime(0);

    if (clip.telemetry) {
      if (clip.telemetry.vehicleA) setVehicleA((prev) => ({ ...prev, ...clip.telemetry.vehicleA }));
      if (clip.telemetry.vehicleB) setVehicleB((prev) => ({ ...prev, ...clip.telemetry.vehicleB }));
      if (clip.telemetry.environment) setEnvironment((prev) => ({ ...prev, ...clip.telemetry.environment }));
    }
  }, []);

  /**
   * Handle Video Upload
   * - Saves internally.
   * - Immediately plays the uploaded video.
   * - Does NOT add uploaded videos to the dropdown list.
   * - Reuses existing prediction pipeline, Risk Engine, Severity Engine.
   */
  const handleVideoUpload = useCallback(async (file) => {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    const clipId = `UPLOAD-${Date.now().toString().slice(-4)}`;
    const cleanName = file.name.replace(/\.[^/.]+$/, '');

    const newClip = {
      clipId,
      scenarioId: clipId,
      label: `Upload: ${cleanName}`,
      location: 'Live Upload Video Feed (GPS Corridor Stream)',
      sourceUrl: objectUrl,
      isUploaded: true,
      fileName: file.name,
      fileSize: file.size,
      description: `User uploaded video stream "${file.name}".`,
      telemetry: {
        vehicleA: { type: 'BUS #07', speed: 46, distance: 32, brakingCapability: 'medium', reactionTime: 1.1, mass: 12000, heading: 'toward intersection' },
        vehicleB: { type: 'CAR #12', speed: 18, distance: 22, brakingCapability: 'medium', reactionTime: 1.0, mass: 1400, heading: 'crossing intersection' },
        environment: { roadCondition: 'wet', visibility: 'good', trafficDensity: 'moderate', trafficSignal: 'yellow' }
      }
    };

    // Set active uploaded video (NOT added to dropdown)
    setUploadedVideo(newClip);
    setSelectedClipId(clipId);
    setInputModeState('uploaded');
    setCustomVideoUrl(objectUrl);
    setVideoSeekTime(0);

    // Apply telemetry and recalculate risk
    setVehicleA(newClip.telemetry.vehicleA);
    setVehicleB(newClip.telemetry.vehicleB);
    setEnvironment(newClip.telemetry.environment);
  }, []);

  /**
   * Complete Prediction Workflow
   * - Evaluates current risk against configured collisionThreshold
   * - If risk < collisionThreshold:
   *     - Generates complete Prevention Analysis & Report
   *     - Saves into Reported Incidents History
   *     - Auto-navigates to /rescue/analysis
   *     - Hides "Go to Police Dashboard" button
   * - If risk >= collisionThreshold:
   *     - Generates complete Incident Analysis & Report
   *     - Saves into Reported Incidents History
   *     - Auto-navigates to /rescue/analysis
   *     - Displays "Go to Police Dashboard" button only after report is ready
   *     - Does NOT auto-navigate to Police Dashboard
   */
  const runPredictionWorkflow = useCallback(async (navigate) => {
    setIsPredictionRunning(true);
    try {
      const risk = await recalculateRisk();
      const riskScore = Number(risk?.predictedCollisionRisk ?? 30);
      const isCollision = riskScore >= collisionThreshold;

      if (!isCollision) {
        // Prevention Analysis Scenario (Risk < Threshold)
        const prevId = `PREV-${Date.now().toString().slice(-6)}`;
        const loc = selectedClipData?.location || 'Chennai Central Junction';
        const preventionRecord = {
          id: prevId,
          incidentId: prevId,
          timestamp: new Date().toISOString(),
          location: loc,
          status: 'PREVENTED',
          isCollision: false,
          isPrevention: true,
          reportReady: true,
          severityLevel: 'SAFE',
          severityScore: Math.round(riskScore),
          severity: {
            level: 'SAFE',
            score: Math.round(riskScore),
            description: `Safe traffic headway verified (${riskScore}% risk). Proactive AI Shadow prevention protocols active.`
          },
          impactSpeedKmH: 0,
          gForceB: 0.1,
          vehicleA,
          vehicleB,
          telemetry: { vehicleA, vehicleB, environment, riskAtCollision: riskScore, location: loc },
          dispatches: [],
          responseTimeline: [
            { step: 1, label: 'Headway Distance & Approach Kinematics Evaluated', time: '0.0s', duration: 40, status: 'COMPLETED' },
            { step: 2, label: 'Proactive Optical Conflict Zone Clear', time: '+0.5s', duration: 60, status: 'COMPLETED' },
            { step: 3, label: 'Safe Stopping Distance Margin Confirmed', time: '+1.0s', duration: 55, status: 'COMPLETED' },
            { step: 4, label: 'AI Prevention Audit Finalized & Archived', time: '+1.5s', duration: 35, status: 'COMPLETED' }
          ],
          preventionInsights: [
            {
              id: 'PREV-01',
              category: 'CORRIDOR_SAFETY',
              title: 'Sufficient Headway Distance Confirmed',
              recommendation: 'Vehicular approach distance exceeds required braking distance margin by >18 meters.',
              impact: 'Zero collision hazard detected during vision evaluation window.',
              priority: 'OPTIMAL'
            },
            {
              id: 'PREV-02',
              category: 'V2X_TELEMETRY',
              title: 'Connected Corridor Heartbeat Verified',
              recommendation: 'Automated signal priority and speed compliance verified for this intersection.',
              impact: 'Maintains low conflict probability under normal operational flow.',
              priority: 'ACTIVE'
            }
          ]
        };

        setActiveIncident(preventionRecord);
        setIncidentsList((prev) => [preventionRecord, ...prev]);

        // Auto-navigate to Incident Analysis tab
        if (navigate) {
          navigate('/rescue/analysis');
        }
        return preventionRecord;
      } else {
        // Collision Scenario (Risk >= Threshold)
        const incident = await triggerCollisionSimulation({
          vehicleA,
          vehicleB,
          environment,
          riskAtCollision: riskScore,
          location: selectedClipData?.location || 'Chennai Outer Ring Road'
        });

        // Auto-navigate to Incident Analysis tab
        if (navigate) {
          navigate('/rescue/analysis');
        }
        return incident;
      }
    } finally {
      setIsPredictionRunning(false);
    }
  }, [collisionThreshold, recalculateRisk, vehicleA, vehicleB, environment, selectedClipData]);

  /**
   * Police Acknowledges Incident & Requests Hospital Dispatch
   */
  const acknowledgePoliceIncident = useCallback((hospital) => {
    const hosp = hospital || assignedHospital || selectNearestSuitableHospital(activeIncident?.location);
    const ambulanceReq = createAmbulanceDispatchRequest(activeIncident, hosp);

    setAssignedHospital(hosp);
    setAssignedAmbulance(ambulanceReq);
    setPoliceStatus('HOSPITAL_DISPATCH_REQUESTED');
    setHospitalStatus('INCOMING_REQUEST');

    setAmbulanceTracking({
      status: 'DISPATCH_REQUESTED',
      progressPercent: 0,
      speedKmH: 0,
      etaMinutes: hosp.etaMinutes,
      distanceRemainingKm: hosp.distanceKm,
      currentLocation: `${hosp.name} (Emergency Bay)`,
      currentWaypointIndex: 0
    });

    if (activeIncident) {
      setActiveIncident((prev) => ({
        ...prev,
        status: 'Hospital Assigned - Ambulance Request Pending'
      }));
    }
  }, [activeIncident, assignedHospital]);

  /**
   * Hospital Accepts Emergency & Dispatches Ambulance
   * Updates status to: Hospital Assigned, Ambulance Dispatched, En Route
   * Initiates animated route transit tracking.
   */
  const acceptHospitalEmergency = useCallback(() => {
    if (!assignedHospital || !assignedAmbulance) return;

    setHospitalStatus('AMBULANCE_DISPATCHED');
    setPoliceStatus('EN_ROUTE');

    const updatedIncidentStatus = 'Hospital Assigned — Ambulance Dispatched (En Route)';
    setActiveIncident((prev) => (prev ? { ...prev, status: updatedIncidentStatus } : prev));

    const waypoints = assignedHospital.waypoints || [
      { name: `${assignedHospital.name} Bay`, progress: 0 },
      { name: 'Arterial Corridor Expressway', progress: 30 },
      { name: 'Flyover Interchange Approach', progress: 65 },
      { name: `Accident Scene (${activeIncident?.location || 'Collision Site'})`, progress: 100 }
    ];

    setAmbulanceTracking((prev) => ({
      ...prev,
      status: 'EN_ROUTE',
      speedKmH: 64,
      progressPercent: 5
    }));

    if (trackingTimerRef.current) clearInterval(trackingTimerRef.current);

    let progress = 5;
    trackingTimerRef.current = setInterval(() => {
      progress += 10;

      if (progress >= 100) {
        clearInterval(trackingTimerRef.current);
        trackingTimerRef.current = null;

        const sceneLoc = `Accident Scene (${activeIncident?.location || 'Target Site'})`;
        setAmbulanceTracking({
          status: 'ARRIVED_AT_SCENE',
          progressPercent: 100,
          speedKmH: 0,
          etaMinutes: 0,
          distanceRemainingKm: 0,
          currentLocation: sceneLoc,
          currentWaypointIndex: waypoints.length - 1
        });
        setPoliceStatus('PATROL_AT_SCENE');
        setHospitalStatus('ARRIVED_AT_SCENE');
        setActiveIncident((prev) => (prev ? { ...prev, status: 'Ambulance Arrived at Scene — Trauma Triage Active' } : prev));
      } else {
        const wpIdx = Math.min(
          waypoints.length - 1,
          Math.floor((progress / 100) * waypoints.length)
        );
        const currentWp = waypoints[wpIdx]?.name || 'Transit Corridor';
        const totalEta = assignedHospital?.etaMinutes || 4;
        const remainingEta = Math.max(0.5, Number(((totalEta * (100 - progress)) / 100).toFixed(1)));
        const totalDist = assignedHospital?.distanceKm || 3.0;
        const remainingDist = Math.max(0.2, Number(((totalDist * (100 - progress)) / 100).toFixed(1)));

        setAmbulanceTracking({
          status: 'EN_ROUTE',
          progressPercent: progress,
          speedKmH: 68 + Math.round((Math.random() - 0.5) * 6),
          etaMinutes: remainingEta,
          distanceRemainingKm: remainingDist,
          currentLocation: currentWp,
          currentWaypointIndex: wpIdx
        });
      }
    }, 1800);
  }, [assignedHospital, assignedAmbulance, activeIncident]);

  const updateVehicleA = (fields) => setVehicleA((prev) => ({ ...prev, ...fields }));
  const updateVehicleB = (fields) => setVehicleB((prev) => ({ ...prev, ...fields }));
  const updateEnvironment = (fields) => setEnvironment((prev) => ({ ...prev, ...fields }));

  return (
    <AppContext.Provider
      value={{
        inputMode,
        setInputMode,
        customVideoUrl,
        confidenceThresh,
        setConfidenceThresh,
        frameSampling,
        setFrameSampling,
        collisionThreshold,
        setCollisionThreshold,
        visionStatus,
        selectedClipId,
        setSelectedClipId,
        selectedClipData,
        videoSeekTime,
        setVideoSeekTime,
        selectVideoClip,
        internalVideos: INTERNAL_VIDEOS,
        uploadedVideo,
        handleVideoUpload,
        isPredictionRunning,
        runPredictionWorkflow,
        vehicleA,
        setVehicleA,
        vehicleB,
        setVehicleB,
        environment,
        setEnvironment,
        riskResult,
        setRiskResult,
        activeIncident,
        setActiveIncident,
        incidentsList,
        alertsList,
        analyticsData,
        soundEnabled,
        setSoundEnabled,
        liveVideoElement,
        setLiveVideoElement,
        updateVehicleA,
        updateVehicleB,
        updateEnvironment,
        recalculateRisk,
        triggerCollisionSimulation,
        refreshData,
        // Post-Accident Workflow & Real-Time Coordination
        policeStatus,
        setPoliceStatus,
        hospitalStatus,
        setHospitalStatus,
        assignedHospital,
        setAssignedHospital,
        assignedAmbulance,
        setAssignedAmbulance,
        ambulanceTracking,
        setAmbulanceTracking,
        acknowledgePoliceIncident,
        acceptHospitalEmergency
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
