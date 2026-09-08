import React from 'react';
import { Camera, Video, Upload, Play, MapPin, ShieldAlert, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { MANIFEST_VIDEOS, VIDEO_STATE_GROUPS } from '../../data/manifestVideos.js';

export default function CameraControls() {
  const {
    inputMode,
    setInputMode,
    confidenceThresh,
    setConfidenceThresh,
    frameSampling,
    setFrameSampling,
    selectedClipId,
    selectedClipData,
    selectVideoClip,
    recalculateRisk
  } = useApp();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setInputMode('uploaded', url);
    }
  };

  const handleClipChange = (e) => {
    const clipId = e.target.value;
    selectVideoClip(clipId);
  };

  const getBadgeClass = (state) => {
    switch (state) {
      case 'SAFE':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'WARNING':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'CRITICAL':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'ACCIDENT':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'EMERGENCY':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      default:
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    }
  };

  return (
    <div className="bg-navy-900 border border-slate-800 rounded-xl p-4 space-y-4 font-mono text-xs shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-slate-100 uppercase text-xs">
            VIDEO SELECTION & SIMULATION DATASET (28 VIDEOS)
          </h3>
        </div>
        <span className="text-[10px] text-slate-400">
          ACTIVE CLIP: <strong className="text-cyan-300">{selectedClipId}</strong>
        </span>
      </div>

      {/* 28-Video Manifest Dropdown Selector */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-cyan-400" />
            SELECT VIDEO SCENARIO (28 TAMIL NADU DATASET CLIPS):
          </span>
          <span className="text-[10px] text-slate-500">manifest.csv</span>
        </label>

        <select
          value={selectedClipId}
          onChange={handleClipChange}
          className="w-full bg-slate-950 border border-slate-700 hover:border-cyan-500/60 focus:border-cyan-400 focus:outline-none rounded-lg p-2.5 text-xs text-slate-100 cursor-pointer transition-all shadow-inner font-mono"
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

      {/* Selected Video Information & Telemetry Card */}
      {selectedClipData && (
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getBadgeClass(selectedClipData.state)}`}>
                ● {selectedClipData.state}
              </span>
              <span className="font-bold text-slate-100 text-xs">
                {selectedClipData.clipId}: {selectedClipData.scenario}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-cyan-300">
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span>{selectedClipData.location}</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
            {selectedClipData.description}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[10px]">
            <div className="bg-navy-900/80 p-1.5 rounded border border-slate-800">
              <span className="text-slate-500 block">VEHICLE A:</span>
              <span className="font-bold text-amber-400">
                {selectedClipData.telemetry?.vehicleA?.type} @ {selectedClipData.telemetry?.vehicleA?.speed} km/h
              </span>
            </div>
            <div className="bg-navy-900/80 p-1.5 rounded border border-slate-800">
              <span className="text-slate-500 block">VEHICLE B:</span>
              <span className="font-bold text-cyan-400">
                {selectedClipData.telemetry?.vehicleB?.type} @ {selectedClipData.telemetry?.vehicleB?.speed} km/h
              </span>
            </div>
            <div className="bg-navy-900/80 p-1.5 rounded border border-slate-800">
              <span className="text-slate-500 block">ROAD / WEATHER:</span>
              <span className="font-bold text-slate-200">
                {selectedClipData.telemetry?.environment?.roadCondition} / {selectedClipData.telemetry?.environment?.visibility}
              </span>
            </div>
            <div className="bg-navy-900/80 p-1.5 rounded border border-slate-800">
              <span className="text-slate-500 block">SIGNAL STATE:</span>
              <span className="font-bold text-emerald-300 uppercase">
                {selectedClipData.telemetry?.environment?.trafficSignal || 'GREEN'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Input Source Toggles */}
      <div className="space-y-1.5 pt-1">
        <div className="text-[10px] text-slate-400 uppercase font-bold">Alternative Input Source Modes:</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={() => setInputMode('demo')}
            className={`px-3 py-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              inputMode === 'demo'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            Dataset Clip Player
          </button>

          <label
            className={`px-3 py-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              inputMode === 'uploaded'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Custom Video
            <input type="file" accept="video/mp4,video/webm" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={() => setInputMode('webcam')}
            className={`px-3 py-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              inputMode === 'webcam'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            Live Webcam Feed
          </button>
        </div>
      </div>

      {/* Calibration Sliders */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-[11px]">
        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span>Confidence Threshold:</span>
            <span className="text-cyan-400 font-bold">{Math.round(confidenceThresh * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.3"
            max="0.9"
            step="0.05"
            value={confidenceThresh}
            onChange={(e) => setConfidenceThresh(Number(e.target.value))}
            className="w-full accent-cyan-500 bg-slate-800 rounded h-1 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span>Frame Sampling Rate:</span>
            <span className="text-cyan-400 font-bold">{frameSampling}x</span>
          </div>
          <input
            type="range"
            min="1"
            max="4"
            step="1"
            value={frameSampling}
            onChange={(e) => setFrameSampling(Number(e.target.value))}
            className="w-full accent-cyan-500 bg-slate-800 rounded h-1 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
