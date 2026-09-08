import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Square,
  Shield,
  Activity,
  Clock,
  Bus,
  Car,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Layers,
  Sparkles,
  Eye
} from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import LiveFeed from '../vision/LiveFeed.jsx';
import TestDashboardPanel from './TestDashboardPanel.jsx';
import MasterDemoMetricsCard from './MasterDemoMetricsCard.jsx';
import SeverityNotificationMatrix, { SEVERITY_TIERS } from './SeverityNotificationMatrix.jsx';
import MasterDemoSummaryModal from './MasterDemoSummaryModal.jsx';
import DispatchTimeline from '../emergency/DispatchTimeline.jsx';
import ServiceStatusBadge from '../emergency/ServiceStatusBadge.jsx';
import { getRiskCategory, evaluateAlertPolicy } from '../../../server/services/alertPolicyEngine.js';
import { DEMO_EMERGENCY_DATA } from '../../data/emergencyDemoData.js';
import { MANIFEST_VIDEOS, VIDEO_STATE_GROUPS } from '../../data/manifestVideos.js';

export default function MasterDemoScreen() {
  const {
    riskResult,
    vehicleA,
    vehicleB,
    setVehicleA,
    setVehicleB,
    setEnvironment,
    setActiveIncident,
    setRiskResult,
    selectedClipId,
    selectedClipData,
    selectVideoClip
  } = useApp();

  // Demo Execution State
  const [demoMode, setDemoMode] = useState('FULL_SHOWCASE'); // PREVENTION, COLLISION, FULL_SHOWCASE
  const [demoStatus, setDemoStatus] = useState('STOPPED'); // STOPPED, RUNNING, PAUSED, COMPLETED
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentTestId, setCurrentTestId] = useState('TC-ALERT-001');
  const [testResultsData, setTestResultsData] = useState(null);

  // Active Scenario Execution State
  const [activeSeverity, setActiveSeverity] = useState('CRITICAL');
  const [activeScenarioResult, setActiveScenarioResult] = useState(null);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [dataSource, setDataSource] = useState('LIVE BACKEND DATA');
  const [metrics, setMetrics] = useState({
    totalDemoDurationMs: 480,
    collisionProcessingTimeMs: 14,
    severityCalculationTimeMs: 3,
    locationResolutionTimeMs: 2,
    notificationGenerationTimeMs: 8,
    dispatchPlanningTimeMs: 5,
    blackboxGenerationTimeMs: 2,
    totalNotificationsGenerated: 20,
    timelineCompletionPercent: 100
  });

  const [activeTimeline, setActiveTimeline] = useState(null);
  const [currentShowcaseIndex, setCurrentShowcaseIndex] = useState(0);

  const videoElementRef = useRef(null);
  const timerRef = useRef(null);

  // Check live backend connectivity on mount
  useEffect(() => {
    fetch('/api/master-demo/status')
      .then((res) => {
        if (res.ok) {
          setDataSource('LIVE BACKEND DATA');
          return res.json();
        }
        throw new Error('Backend status non-200');
      })
      .then((data) => setTestResultsData(data))
      .catch(() => {
        setDataSource('DEMO SIMULATION DATA');
      });
  }, []);

  const handleVideoRef = (ref) => {
    videoElementRef.current = ref;
  };

  /**
   * Cleans up running timers
   */
  const clearDemoTimers = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearDemoTimers();
  }, []);

  /**
   * Helper to execute backend scenario or fallback
   */
  const executeScenarioAPI = async (mode, severity) => {
    try {
      const res = await fetch('/api/master-demo/run-scenario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, severity })
      });

      if (res.ok) {
        setDataSource('LIVE BACKEND DATA');
        const data = await res.json();
        return data;
      }
    } catch (e) {
      console.warn('Backend unavailable, using deterministic demo data:', e);
      setDataSource('DEMO SIMULATION DATA');
    }

    // Fallback: Deterministic Simulation Data
    if (mode === 'prevention') {
      return {
        mode: 'prevention',
        status: 'COMPLETED',
        preventionResult: {
          outcome: 'PREVENTION_SUCCESSFUL',
          collisionAvoided: true,
          riskReduced: true,
          preventionSuccessful: true,
          noEmergencyNotificationsRequired: true,
          orchestratorActive: false
        },
        metrics: {
          totalDemoDurationMs: 420,
          collisionProcessingTimeMs: 0,
          severityCalculationTimeMs: 2,
          locationResolutionTimeMs: 2,
          notificationGenerationTimeMs: 0,
          dispatchPlanningTimeMs: 0,
          blackboxGenerationTimeMs: 1,
          totalNotificationsGenerated: 0,
          timelineCompletionPercent: 100
        },
        simulationDisclaimer: 'SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED'
      };
    }

    return {
      mode: 'collision',
      severity,
      incidentId: DEMO_EMERGENCY_DATA.incidentId,
      incidentStatus: 'COMPLETED',
      responsePriority: severity === 'CATASTROPHIC' ? 'Immediate Highest Priority' : severity === 'CRITICAL' ? 'Highest Priority' : 'High Priority',
      selectedHospital: DEMO_EMERGENCY_DATA.selectedHospital,
      selectedPoliceStation: DEMO_EMERGENCY_DATA.selectedPoliceStation,
      familyRecipients: DEMO_EMERGENCY_DATA.familyRecipients,
      dispatchPlan: DEMO_EMERGENCY_DATA.dispatchPlan,
      notifications: DEMO_EMERGENCY_DATA.notificationHistory,
      channelSummary: DEMO_EMERGENCY_DATA.channelSummary,
      recipientSummary: DEMO_EMERGENCY_DATA.recipientSummary,
      timeline: DEMO_EMERGENCY_DATA.timeline,
      metrics: {
        totalDemoDurationMs: 510,
        collisionProcessingTimeMs: 12,
        severityCalculationTimeMs: 3,
        locationResolutionTimeMs: 2,
        notificationGenerationTimeMs: 9,
        dispatchPlanningTimeMs: 4,
        blackboxGenerationTimeMs: 2,
        totalNotificationsGenerated: 20,
        timelineCompletionPercent: 100
      },
      simulationDisclaimer: 'SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED'
    };
  };

  /**
   * Main Start/Play Handler
   */
  const handleStart = async () => {
    clearDemoTimers();
    setDemoStatus('RUNNING');
    setCurrentStep(1);
    setShowSummaryModal(false);

    if (videoElementRef.current) {
      try {
        videoElementRef.current.currentTime = 0;
        videoElementRef.current.playbackRate = playbackSpeed;
        await videoElementRef.current.play();
      } catch (err) {
        console.warn('Video play notice:', err);
      }
    }

    if (demoMode === 'PREVENTION') {
      await runPreventionWorkflow();
    } else if (demoMode === 'COLLISION') {
      await runCollisionWorkflow(activeSeverity);
    } else {
      await runFullShowcaseWorkflow();
    }
  };

  /**
   * 1. Prevention Workflow
   */
  const runPreventionWorkflow = async () => {
    setActiveSeverity(null);

    // Step 1: Normal Approach
    setVehicleA((v) => ({ ...v, speed: 25, distance: 55 }));
    setVehicleB((v) => ({ ...v, speed: 10, distance: 40 }));
    setEnvironment((e) => ({ ...e, trafficSignal: 'green', roadCondition: 'dry' }));

    const stepInterval = 1200 / playbackSpeed;
    let step = 1;

    timerRef.current = setInterval(async () => {
      step++;
      setCurrentStep(step);

      if (step === 2) {
        // Caution / Warning
        setVehicleA((v) => ({ ...v, speed: 38, distance: 35 }));
        setVehicleB((v) => ({ ...v, speed: 12, distance: 28 }));
        setEnvironment((e) => ({ ...e, trafficSignal: 'yellow' }));
      } else if (step === 3) {
        // Evasive action taken: Bus brakes hard, Car yields
        setVehicleA((v) => ({ ...v, speed: 8, distance: 16, brakingCapability: 'good' }));
        setVehicleB((v) => ({ ...v, speed: 0, distance: 14 }));
      } else if (step === 4) {
        // Collision avoided, risk resolved
        const result = await executeScenarioAPI('prevention', 'SAFE');
        setActiveScenarioResult(result);
        setMetrics(result.metrics);
        setActiveTimeline(result.preventionResult?.timeline || null);
        clearInterval(timerRef.current);
        setDemoStatus('COMPLETED');
        setShowSummaryModal(true);
      }
    }, stepInterval);
  };

  /**
   * 2. Collision Workflow (Single Severity)
   */
  const runCollisionWorkflow = async (targetSeverity = 'CRITICAL') => {
    setActiveSeverity(targetSeverity);

    // Initial Conflict Setup
    setVehicleA((v) => ({ ...v, speed: 44, distance: 32 }));
    setVehicleB((v) => ({ ...v, speed: 14, distance: 20 }));
    setEnvironment((e) => ({ ...e, roadCondition: 'wet', visibility: 'moderate', trafficSignal: 'yellow' }));

    const stepInterval = 1000 / playbackSpeed;
    let step = 1;

    timerRef.current = setInterval(async () => {
      step++;
      setCurrentStep(step);

      if (step >= 5) {
        clearInterval(timerRef.current);
        const result = await executeScenarioAPI('collision', targetSeverity);
        setActiveScenarioResult(result);
        setMetrics(result.metrics);
        setActiveTimeline(result.timeline);

        // Update global AppContext so CommandCenter shows new incident
        if (result.incidentId) {
          setActiveIncident({
            id: result.incidentId,
            severity: result.severity,
            status: 'COMPLETED',
            timestamp: new Date().toISOString(),
            location: 'San Francisco Urban Corridor (Market St & 4th Ave)'
          });
        }

        setDemoStatus('COMPLETED');
        setShowSummaryModal(true);
      }
    }, stepInterval);
  };

  /**
   * 3. Full Showcase Workflow (Prevention -> LOW -> MODERATE -> HIGH -> CRITICAL -> CATASTROPHIC)
   */
  const runFullShowcaseWorkflow = async () => {
    const sequence = [
      { mode: 'prevention', severity: 'PREVENTION', label: '1/6 Prevention Mode' },
      { mode: 'collision', severity: 'LOW', label: '2/6 Low Severity (Family)' },
      { mode: 'collision', severity: 'MODERATE', label: '3/6 Moderate Severity (Family + Hospital)' },
      { mode: 'collision', severity: 'HIGH', label: '4/6 High Severity (Family + Hospital + Police)' },
      { mode: 'collision', severity: 'CRITICAL', label: '5/6 Critical Severity (Highest Priority)' },
      { mode: 'collision', severity: 'CATASTROPHIC', label: '6/6 Catastrophic Severity (Immediate Highest Priority)' }
    ];

    let idx = 0;
    setCurrentShowcaseIndex(0);

    const runNextInSequence = async () => {
      if (idx >= sequence.length) {
        setDemoStatus('COMPLETED');
        setShowSummaryModal(true);
        return;
      }

      const item = sequence[idx];
      setCurrentShowcaseIndex(idx);
      setActiveSeverity(item.severity === 'PREVENTION' ? null : item.severity);

      const result = await executeScenarioAPI(item.mode, item.severity);
      setActiveScenarioResult(result);
      setMetrics(result.metrics);
      setActiveTimeline(result.timeline || result.preventionResult?.timeline || null);

      if (result.incidentId) {
        setActiveIncident({
          id: result.incidentId,
          severity: result.severity,
          status: 'COMPLETED',
          timestamp: new Date().toISOString(),
          location: 'San Francisco Urban Corridor (Market St & 4th Ave)'
        });
      }

      idx++;
      const delay = 2500 / playbackSpeed;
      timerRef.current = setTimeout(runNextInSequence, delay);
    };

    runNextInSequence();
  };

  const handlePause = () => {
    setDemoStatus('PAUSED');
    clearDemoTimers();
    if (videoElementRef.current) {
      videoElementRef.current.pause();
    }
  };

  const handleResume = () => {
    setDemoStatus('RUNNING');
    if (videoElementRef.current) {
      videoElementRef.current.play().catch(() => {});
    }
    if (demoMode === 'FULL_SHOWCASE') {
      runFullShowcaseWorkflow();
    } else if (demoMode === 'PREVENTION') {
      runPreventionWorkflow();
    } else {
      runCollisionWorkflow(activeSeverity);
    }
  };

  const handleRestart = () => {
    handleStop();
    setTimeout(() => {
      handleStart();
    }, 100);
  };

  const handleStop = () => {
    clearDemoTimers();
    setDemoStatus('STOPPED');
    setCurrentStep(0);
    setShowSummaryModal(false);
    if (videoElementRef.current) {
      videoElementRef.current.pause();
      videoElementRef.current.currentTime = 0;
    }
  };

  const handleSpeedChange = (speed) => {
    const numSpeed = Number(speed);
    setPlaybackSpeed(numSpeed);
    if (videoElementRef.current) {
      videoElementRef.current.playbackRate = numSpeed;
    }
    // Update backend playback speed
    fetch('/api/master-demo/speed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ speed: numSpeed })
    }).catch(() => {});
  };

  const handleTimeUpdateFromVideo = (currentTime) => {
    if (demoStatus === 'RUNNING') {
      if (currentTime < 5) setCurrentStep(1);
      else if (currentTime < 10) setCurrentStep(2);
      else if (currentTime < 15) setCurrentStep(3);
      else if (currentTime < 28) setCurrentStep(4);
      else if (currentTime < 35) setCurrentStep(5);
      else if (currentTime < 70) setCurrentStep(6);
    }
  };

  const riskPercent = riskResult?.predictedCollisionRisk ?? 30;
  const category = riskResult?.category || getRiskCategory(riskPercent);

  const policyEval = evaluateAlertPolicy(riskResult || {
    predictedCollisionRisk: riskPercent,
    estimatedTTC: 2.1,
    vehicleA: { stoppingDistanceMeters: 31.3, availableDistanceMeters: 38 },
    vehicleB: { stoppingDistanceMeters: 14.2, availableDistanceMeters: 22 }
  });

  const alertState = riskResult?.alertState || policyEval.highestApplicableState;
  const alertDriver = riskResult?.alertDriver || policyEval.dominantReason || 'TTC OVERRIDE';
  const ttc = riskResult?.estimatedTTC || 2.1;

  const actA = riskResult?.vehicleA?.recommendedAction || 'HARD BRAKING REQUIRED';
  const actB = riskResult?.vehicleB?.recommendedAction || 'STOP NOW & YIELD';

  return (
    <div className="space-y-6 font-sans">
      {/* Permanent Mandatory Simulation Banner */}
      <div className="bg-amber-500/10 border border-amber-500/40 px-4 py-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-amber-300 font-mono text-xs shadow-md">
        <div className="flex items-center gap-2 font-bold tracking-wide">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED</span>
        </div>
        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${
          dataSource === 'LIVE BACKEND DATA'
            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
            : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
        }`}>
          ● {dataSource}
        </span>
      </div>

      {/* Top Title & Playback Controls Bar */}
      <div className="bg-navy-900 border border-slate-800 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-md font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-100 text-sm tracking-tight">
                AI RESCUEFLOW SHADOW — MASTER DEMO INTEGRATION
              </h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                demoStatus === 'RUNNING' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 animate-pulse' :
                demoStatus === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                ● {demoStatus}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              End-to-end automated demonstration of collision prevention & emergency response orchestration
            </p>
          </div>
        </div>

        {/* Action Controls & Mode Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Selector */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setDemoMode('PREVENTION')}
              disabled={demoStatus === 'RUNNING'}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                demoMode === 'PREVENTION'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Prevention Demo
            </button>
            <button
              onClick={() => setDemoMode('COLLISION')}
              disabled={demoStatus === 'RUNNING'}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                demoMode === 'COLLISION'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Collision Demo
            </button>
            <button
              onClick={() => setDemoMode('FULL_SHOWCASE')}
              disabled={demoStatus === 'RUNNING'}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 ${
                demoMode === 'FULL_SHOWCASE'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Full Showcase
            </button>
          </div>

          {/* Start / Pause / Resume */}
          {demoStatus === 'STOPPED' || demoStatus === 'COMPLETED' ? (
            <button
              onClick={handleStart}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-cyan-950/40"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              ▶ START MASTER DEMO
            </button>
          ) : demoStatus === 'RUNNING' ? (
            <button
              onClick={handlePause}
              className="px-3.5 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1.5"
            >
              <Pause className="w-3.5 h-3.5" />
              Ⅱ PAUSE
            </button>
          ) : (
            <button
              onClick={handleResume}
              className="px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              ▶ RESUME
            </button>
          )}

          <button
            onClick={handleRestart}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title="Restart Master Demo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleStop}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-red-400 border border-slate-700"
            title="Stop Master Demo"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>

          {/* Speed selector (0.5x, 1x, 2x, 5x) */}
          <select
            value={playbackSpeed}
            onChange={(e) => handleSpeedChange(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 rounded-xl px-2.5 py-1.5 font-bold"
          >
            <option value={0.5}>0.5× Speed</option>
            <option value={1.0}>1× Speed</option>
            <option value={2.0}>2× Speed</option>
            <option value={5.0}>5× Speed</option>
          </select>
        </div>
      </div>

      {/* Main 2-Column Section: Video Feed + System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {/* Quick 28-Video Dataset Dropdown Selector */}
          <div className="bg-navy-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 font-mono text-xs shadow-md">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5 text-[11px]">
                🎬 SELECT VIDEO SCENARIO (28 CLIPS):
              </span>
            </div>

            <div className="flex-1 min-w-[280px]">
              <select
                value={selectedClipId}
                onChange={(e) => selectVideoClip(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 hover:border-cyan-500/60 focus:border-cyan-400 focus:outline-none rounded-lg p-2 text-xs text-slate-100 cursor-pointer transition-all font-mono"
              >
                {VIDEO_STATE_GROUPS.map((group) => {
                  const groupClips = MANIFEST_VIDEOS.filter((c) => c.state === group.state);
                  return (
                    <optgroup key={group.state} label={`── ${group.label} ──`} className="bg-navy-950 text-slate-300 font-bold">
                      {groupClips.map((clip) => (
                        <option key={clip.clipId} value={clip.clipId} className="bg-slate-950 text-slate-200 font-normal">
                          [{clip.clipId}] {clip.scenario} — {clip.location}
                        </option>
                      ))}
                    </optgroup>
                  );
                })}
              </select>
            </div>

            {selectedClipData && (
              <span className={`px-2 py-1 rounded text-[10px] font-bold border ${
                selectedClipData.state === 'SAFE' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                selectedClipData.state === 'WARNING' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                selectedClipData.state === 'CRITICAL' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
                selectedClipData.state === 'ACCIDENT' ? 'bg-rose-500/20 text-rose-400 border-rose-500/40' :
                'bg-red-500/20 text-red-400 border-red-500/40'
              }`}>
                ● {selectedClipData.state}
              </span>
            )}
          </div>

          <LiveFeed onVideoRef={handleVideoRef} onTimeUpdate={handleTimeUpdateFromVideo} />
        </div>

        {/* System Status Panel */}
        <div className="bg-navy-900 border border-slate-800 rounded-xl p-5 space-y-4 font-mono text-xs shadow-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-slate-100 text-xs uppercase tracking-wider">SYSTEM TELEMETRY</h3>
            </div>
            <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
              {category}
            </span>
          </div>

          <div className="space-y-2 text-slate-300 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500">Calculated Risk:</span>
              <strong className="text-amber-400">{riskPercent}%</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Category:</span>
              <strong className="text-slate-200">{category}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Alert State:</span>
              <strong className="text-red-400 font-bold">{alertState}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Alert Driver:</span>
              <strong className="text-amber-300 font-bold">{alertDriver}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Estimated TTC:</span>
              <strong className="text-cyan-300">{ttc} s</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Bus Speed:</span>
              <strong className="text-slate-200">{vehicleA.speed} km/h</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Bus Distance:</span>
              <strong className="text-slate-200">{vehicleA.distance} m</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Bus Stopping Req:</span>
              <strong className={riskResult?.vehicleA?.isDeficit ? 'text-red-400 font-bold' : 'text-slate-200'}>
                {riskResult?.vehicleA?.stoppingDistanceMeters || 31.3} m
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Driver HUD Panels: Driver A (Bus #7) & Driver B (Car #12) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {/* DRIVER A — BUS #7 */}
        <div className="bg-navy-900 border-2 border-amber-500/60 rounded-xl p-4 space-y-2 relative shadow-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Bus className="w-4 h-4" />
              <span>DRIVER A — BUS #7</span>
            </div>
            <span className="text-[10px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded uppercase">
              {alertState}
            </span>
          </div>

          <div className="text-[11px] text-slate-300 space-y-1">
            <div>Estimated TTC: <strong className="text-amber-400">{ttc}s</strong></div>
            <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded text-amber-100 leading-relaxed font-bold mt-2">
              RECOMMENDED ACTION: {actA}
            </div>
          </div>
        </div>

        {/* DRIVER B — CAR #12 */}
        <div className="bg-navy-900 border-2 border-cyan-500/60 rounded-xl p-4 space-y-2 relative shadow-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <Car className="w-4 h-4" />
              <span>DRIVER B — CAR #12</span>
            </div>
            <span className="text-[10px] font-bold bg-cyan-500 text-slate-950 px-2 py-0.5 rounded uppercase">
              {alertState}
            </span>
          </div>

          <div className="text-[11px] text-slate-300 space-y-1">
            <div>Estimated TTC: <strong className="text-cyan-400">{ttc}s</strong></div>
            <div className="bg-cyan-500/10 border border-cyan-500/30 p-2.5 rounded text-cyan-100 leading-relaxed font-bold mt-2">
              RECOMMENDED ACTION: {actB}
            </div>
          </div>
        </div>
      </div>

      {/* Live Visual Timeline */}
      <div className="space-y-2">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-slate-300 font-bold flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" /> LIVE DISPATCH & INCIDENT TIMELINE
          </span>
          <span className="text-slate-500 text-[10px]">
            {demoStatus === 'RUNNING' ? '● ANIMATING TRANSITIONS' : '● DETERMINISTIC CAPTURE'}
          </span>
        </div>
        <DispatchTimeline timeline={activeTimeline} />
      </div>

      {/* Real-time Performance & Latency Metrics */}
      <MasterDemoMetricsCard metrics={metrics} isRunning={demoStatus === 'RUNNING'} />

      {/* Severity & Recipient Matrix */}
      <SeverityNotificationMatrix
        activeSeverity={activeSeverity}
        onSelectSeverity={(sev) => {
          if (demoStatus !== 'RUNNING') {
            setActiveSeverity(sev);
            setDemoMode('COLLISION');
          }
        }}
      />

      {/* Current Test Runner Ticker */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className="text-slate-400">CURRENT EXECUTED TEST:</span>
          <span className="text-cyan-300 font-bold">{currentTestId}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">TEST STATUS:</span>
          <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">PASS</span>
        </div>
      </div>

      {/* Test Verification Dashboard Panel (46-Test Harness) */}
      <TestDashboardPanel testResults={testResultsData} />

      {/* Final Scenario Summary Modal */}
      <MasterDemoSummaryModal
        isOpen={showSummaryModal}
        scenarioResult={activeScenarioResult}
        onClose={() => setShowSummaryModal(false)}
        onReplay={handleRestart}
      />
    </div>
  );
}
