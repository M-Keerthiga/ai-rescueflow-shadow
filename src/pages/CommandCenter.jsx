import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Activity,
  AlertOctagon,
  Ambulance,
  Play,
  TrendingUp,
  FileText,
  Clock,
  ArrowRight,
  Eye,
  Camera
} from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';
import LiveFeed from '../components/vision/LiveFeed.jsx';
import CameraControls from '../components/vision/CameraControls.jsx';
import TelemetryPanel from '../components/vision/TelemetryPanel.jsx';
import TrackingPanel from '../components/vision/TrackingPanel.jsx';
import DynamicRiskGauge from '../components/shadow/DynamicRiskGauge.jsx';
import DriverAlertOverlay from '../components/shadow/DriverAlertOverlay.jsx';
import EmergencyCoordinatorPanel from '../components/emergency/EmergencyCoordinatorPanel.jsx';

export default function CommandCenter() {
  const { riskResult, activeIncident, triggerCollisionSimulation, runDemoMode, isDemoRunning } = useApp();
  const navigate = useNavigate();

  const handleSimulateCollision = async () => {
    await triggerCollisionSimulation();
    navigate('/rescue/analysis');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-navy-900 border border-slate-800 p-5 rounded-2xl shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-100 font-mono tracking-tight">
              OPERATIONAL COMMAND CENTER
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              COMPUTER VISION ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Live video optical tracking conflict node — BUS #7 & CAR #12 Homography Telemetry
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => runDemoMode('collision', navigate)}
            disabled={isDemoRunning}
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-500/30 flex items-center gap-2 transition-all shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {isDemoRunning ? 'RUNNING DEMO...' : 'AUTO DEMO MODE'}
          </button>

          <button
            onClick={handleSimulateCollision}
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white border border-red-400/40 flex items-center gap-2 shadow-lg shadow-red-950/40 transition-all"
          >
            <AlertOctagon className="w-4 h-4" />
            SIMULATE COLLISION
          </button>
        </div>
      </div>

      {/* High-Level Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-navy-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>PREDICTED RISK</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">
            {riskResult?.predictedCollisionRisk || 86}%
          </div>
          <div className="text-[10px] text-amber-400 uppercase">
            STATUS: {riskResult?.category || 'CRITICAL'}
          </div>
        </div>

        <div className="bg-navy-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>ESTIMATED TTC</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-300">
            {riskResult?.estimatedTTC || 1.8} sec
          </div>
          <div className="text-[10px] text-slate-400">
            Intersection Conflict Window
          </div>
        </div>

        <div className="bg-navy-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>BUS STOPPING DEFICIT</span>
            <TrendingUp className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-400">
            {riskResult?.vehicleA?.stoppingDistanceMeters || 41.2}m
          </div>
          <div className="text-[10px] text-red-400">
            {riskResult?.vehicleA?.isDeficit ? 'EXCEEDS 38m REMAINING' : 'SAFE MARGIN'}
          </div>
        </div>

        <div className="bg-navy-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>ACTIVE RESCUE UNITS</span>
            <Ambulance className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            4 UNITS
          </div>
          <div className="text-[10px] text-slate-400">
            {activeIncident ? `INCIDENT #${activeIncident.id}` : 'STANDBY MODE'}
          </div>
        </div>
      </div>

      {/* Targeted Dual-Driver Alert Section */}
      <DriverAlertOverlay />

      {/* Emergency Coordination Dashboard Section */}
      <EmergencyCoordinatorPanel />

      {/* Live Video Feed & Vision Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <LiveFeed />
          <CameraControls />
        </div>

        <div className="space-y-4">
          <DynamicRiskGauge />
          <TelemetryPanel />
        </div>
      </div>

      {/* Persistent Vehicle Tracker Table */}
      <TrackingPanel />
    </div>
  );
}
