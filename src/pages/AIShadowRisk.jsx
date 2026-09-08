import React from 'react';
import { Eye, Shield, Video } from 'lucide-react';
import LiveFeed from '../components/vision/LiveFeed.jsx';
import CameraControls from '../components/vision/CameraControls.jsx';
import TelemetryPanel from '../components/vision/TelemetryPanel.jsx';
import TrackingPanel from '../components/vision/TrackingPanel.jsx';
import DynamicRiskGauge from '../components/shadow/DynamicRiskGauge.jsx';
import DriverAlertOverlay from '../components/shadow/DriverAlertOverlay.jsx';
import VehicleInputForm from '../components/shadow/VehicleInputForm.jsx';
import EnvironmentalForm from '../components/shadow/EnvironmentalForm.jsx';

export default function AIShadowRisk() {
  return (
    <div className="space-y-6">
      <div className="bg-navy-900 border border-slate-800 p-5 rounded-2xl shadow-md">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl font-bold text-slate-100 font-mono tracking-tight">
            AI SHADOW — PROACTIVE VISION RISK PREDICTION
          </h1>
        </div>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Real-time Computer Vision video stream analysis, optical homography calibration, vehicle speed estimation, and deterministic collision risk calculation.
        </p>
      </div>

      <DriverAlertOverlay />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <LiveFeed />
          <CameraControls />
          <VehicleInputForm />
          <EnvironmentalForm />
        </div>

        <div className="space-y-4">
          <DynamicRiskGauge />
          <TelemetryPanel />
          <TrackingPanel />
        </div>
      </div>
    </div>
  );
}
