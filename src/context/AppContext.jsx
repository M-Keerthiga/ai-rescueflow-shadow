import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { calculateRisk } from '../../server/services/riskEngine.js';
import { soundManager } from '../components/common/AudioAlertPlayer.js';
import { MANIFEST_VIDEOS } from '../data/manifestVideos.js';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Vision Input & Controls State
  const [inputMode, setInputModeState] = useState('demo'); // demo, uploaded, webcam
  const [customVideoUrl, setCustomVideoUrl] = useState(null);
  const [confidenceThresh, setConfidenceThresh] = useState(0.5);
  const [frameSampling, setFrameSampling] = useState(1);
  const [visionStatus, setVisionStatus] = useState({ modelStatus: 'DEMO_TELEMETRY', isTrained: false });

  // Selected 28 Manifest Video Clip State
  const [selectedClipId, setSelectedClipId] = useState('TN-S01');
  const [videoSeekTime, setVideoSeekTime] = useState(null);

  // Vehicle Telemetry State (Inputs for Deterministic Engine)
  const [vehicleA, setVehicleA] = useState({
    type: 'BUS #7',
    speed: 42,
    distance: 38,
    heading: 'toward intersection',
    brakingCapability: 'medium',
    reactionTime: 1.2,
    mass: 12000
  });

  const [vehicleB, setVehicleB] = useState({
    type: 'CAR #12',
    speed: 8,
    distance: 22,
    heading: 'crossing intersection',
    brakingCapability: 'medium',
    reactionTime: 1.0,
    mass: 1400
  });

  const [environment, setEnvironment] = useState({
    roadCondition: 'wet',
    visibility: 'good',
    trafficDensity: 'moderate',
    trafficSignal: 'yellow'
  });

  // System Stores
  const [riskResult, setRiskResult] = useState(null);
  const [activeIncident, setActiveIncident] = useState(null);
  const [incidentsList, setIncidentsList] = useState([]);
  const [alertsList, setAlertsList] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Demo Mode Dual Path State
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoPath, setDemoPath] = useState('collision'); // 'collision' or 'prevention'
  const [demoStep, setDemoStep] = useState(0);

  // Check Vision API Status on startup
  useEffect(() => {
    fetch('/api/vision/status')
      .then((res) => res.json())
      .then((data) => setVisionStatus(data))
      .catch(() => setVisionStatus({ modelStatus: 'DEMO_TELEMETRY', isTrained: false }));
  }, []);

  const setInputMode = (mode, url = null) => {
    setInputModeState(mode);
    if (url) setCustomVideoUrl(url);
  };

  // Recalculate Risk Function (API Primary + Deterministic Fallback)
  const recalculateRisk = useCallback(async () => {
    try {
      const res = await fetch('/api/risk/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleA, vehicleB, environment })
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

    const fallbackData = calculateRisk(vehicleA, vehicleB, environment);
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

  const triggerCollisionSimulation = async (customTelemetry) => {
    const payload = customTelemetry || {
      vehicleA,
      vehicleB,
      environment,
      riskAtCollision: riskResult?.predictedCollisionRisk || 86
    };

    try {
      const res = await fetch('/api/incidents/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const incident = await res.json();
        setActiveIncident(incident);
        setIncidentsList((prev) => [incident, ...prev]);
        refreshData();
        return incident;
      }
    } catch (e) {
      console.error('Error recording collision incident:', e);
    }
  };

  // Dual-Path Deterministic Demo Mode (Collision vs Prevention)
  const runDemoMode = async (selectedPath = 'collision', onNavigate) => {
    if (isDemoRunning) return;
    setIsDemoRunning(true);
    setDemoPath(selectedPath);
    setDemoStep(1);

    // Step 1: 0-5s Normal Traffic (LOW Risk ~ 24%)
    setVehicleA((v) => ({ ...v, speed: 20, distance: 60 }));
    setVehicleB((v) => ({ ...v, speed: 10, distance: 45 }));
    setEnvironment((e) => ({ ...e, trafficSignal: 'green', roadCondition: 'dry' }));

    setTimeout(() => {
      // Step 2: 5-10s BUS #7 approaches intersection (MEDIUM Risk ~ 46%)
      setDemoStep(2);
      setVehicleA((v) => ({ ...v, speed: 35, distance: 45 }));
      setVehicleB((v) => ({ ...v, speed: 12, distance: 30 }));
      setEnvironment((e) => ({ ...e, trafficSignal: 'yellow' }));

      setTimeout(() => {
        // Step 3: 10-15s CAR #12 enters crossing conflict (HIGH / CRITICAL Risk ~ 86%)
        setDemoStep(3);
        setVehicleA((v) => ({ ...v, speed: 48, distance: 28 }));
        setVehicleB((v) => ({ ...v, speed: 14, distance: 18 }));
        setEnvironment((e) => ({ ...e, roadCondition: 'wet', visibility: 'good' }));

        setTimeout(async () => {
          setDemoStep(4);

          if (selectedPath === 'prevention') {
            // PREVENTION PATH: Driver A brakes & Driver B yields -> Risk drops to SAFE
            setVehicleA((v) => ({ ...v, speed: 10, distance: 15, brakingCapability: 'good' }));
            setVehicleB((v) => ({ ...v, speed: 0, distance: 12 }));
            setEnvironment((e) => ({ ...e, trafficSignal: 'red' }));

            setTimeout(() => {
              setDemoStep(6);
              setIsDemoRunning(false);
            }, 3000);
          } else {
            // COLLISION PATH: Evasive action fails -> Collision simulated -> RescueFlow
            const inc = await triggerCollisionSimulation();
            if (onNavigate) onNavigate('/rescue/analysis');

            setTimeout(() => {
              setDemoStep(5);
              setTimeout(() => {
                setDemoStep(6);
                setIsDemoRunning(false);
              }, 3000);
            }, 3000);
          }
        }, 3000);
      }, 3000);
    }, 3000);
  };

  const selectedClipData = MANIFEST_VIDEOS.find((c) => c.clipId === selectedClipId) || MANIFEST_VIDEOS[0];

  const selectVideoClip = useCallback((clipId) => {
    const clip = MANIFEST_VIDEOS.find((c) => c.clipId === clipId);
    if (!clip) return;

    setSelectedClipId(clipId);
    if (clip.telemetry) {
      if (clip.telemetry.vehicleA) setVehicleA((prev) => ({ ...prev, ...clip.telemetry.vehicleA }));
      if (clip.telemetry.vehicleB) setVehicleB((prev) => ({ ...prev, ...clip.telemetry.vehicleB }));
      if (clip.telemetry.environment) setEnvironment((prev) => ({ ...prev, ...clip.telemetry.environment }));
    }
    if (typeof clip.videoTime === 'number') {
      setVideoSeekTime(clip.videoTime);
    }
  }, []);

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
        visionStatus,
        selectedClipId,
        setSelectedClipId,
        selectedClipData,
        videoSeekTime,
        setVideoSeekTime,
        selectVideoClip,
        manifestVideos: MANIFEST_VIDEOS,
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
        isDemoRunning,
        demoPath,
        demoStep,
        updateVehicleA,
        updateVehicleB,
        updateEnvironment,
        recalculateRisk,
        triggerCollisionSimulation,
        runDemoMode,
        refreshData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

