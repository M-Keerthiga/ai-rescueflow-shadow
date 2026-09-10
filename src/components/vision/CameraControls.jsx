import React, { useRef } from 'react';
import { Camera, Video, Upload, MapPin, Play, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';

export default function CameraControls() {
  const navigate = useNavigate();
  const {
    inputMode,
    setInputMode,
    confidenceThresh,
    setConfidenceThresh,
    frameSampling,
    setFrameSampling,
    collisionThreshold,
    setCollisionThreshold,
    selectedClipId,
    selectedClipData,
    selectVideoClip,
    internalVideos,
    handleVideoUpload,
    isPredictionRunning,
    runPredictionWorkflow
  } = useApp();
  const uploadInputRef = useRef(null);

  const handleClipChange = (e) => {
    const clipId = e.target.value;
    selectVideoClip(clipId);
  };

  const handleRunPrediction = () => {
    runPredictionWorkflow(navigate);
  };

  return (
    <div className="bg-navy-900 border border-slate-800 rounded-xl p-4 space-y-4 font-mono text-xs shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-slate-100 uppercase text-xs">
            VIDEO SELECTION & PREDICTION LIBRARY
          </h3>
        </div>
        <span className="text-[10px] text-slate-400">
          ACTIVE SCENARIO: <strong className="text-cyan-300">{selectedClipData?.scenarioId || selectedClipId}</strong>
        </span>
      </div>

      {/* Internal Video Library Dropdown Selector (No filenames, No category names) */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-cyan-400" />
            SELECT TRAFFIC SCENARIO:
          </span>
          <span className="text-[10px] text-slate-500">Internal Library</span>
        </label>

        <select
          value={inputMode === 'uploaded' ? '' : selectedClipId}
          onChange={handleClipChange}
          className="w-full bg-slate-950 border border-slate-700 hover:border-cyan-500/60 focus:border-cyan-400 focus:outline-none rounded-lg p-2.5 text-xs text-slate-100 cursor-pointer transition-all shadow-inner font-mono"
        >
          {inputMode === 'uploaded' && (
            <option value="" disabled className="text-slate-500">
              [ACTIVE: Uploaded Video Feed]
            </option>
          )}
          {internalVideos.map((clip) => (
            <option key={clip.clipId} value={clip.clipId} className="bg-slate-950 text-slate-200 font-normal">
              {clip.label}
            </option>
          ))}
        </select>
      </div>

      {/* Selected Video Information & Telemetry Card */}
      {selectedClipData && (
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold border bg-cyan-500/10 text-cyan-300 border-cyan-500/30">
                SCENARIO {selectedClipData.scenarioId || selectedClipData.clipId}
              </span>
              <span className="font-bold text-slate-100 text-xs">
                {selectedClipData.location}
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

      {/* Execution Action Button */}
      <div className="pt-1">
        <button
          onClick={handleRunPrediction}
          disabled={isPredictionRunning}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40 transition-all text-xs active:scale-[0.99] disabled:opacity-50"
        >
          {isPredictionRunning ? (
            <>
              <Activity className="w-4 h-4 animate-spin" />
              <span>RUNNING AI PREDICTION & RECONSTRUCTION...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>EXECUTE PREDICTION & GENERATE REPORT</span>
            </>
          )}
        </button>
      </div>

      {/* Input Source Toggles */}
      <div className="space-y-1.5 pt-1 border-t border-slate-800">
        <div className="text-[10px] text-slate-400 uppercase font-bold">Input Source Mode:</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <button
            onClick={() => {
              setInputMode('demo');
              selectVideoClip(selectedClipId);
            }}
            className={`px-3 py-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              inputMode === 'demo'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            Internal Library
          </button>

          <button
            onClick={() => setInputMode('webcam')}
            className={`px-3 py-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              inputMode === 'webcam'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            Live Camera Feed
          </button>

          <button
            onClick={() => uploadInputRef.current?.click()}
            className={`px-3 py-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              inputMode === 'uploaded'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Video
          </button>
          <input
            ref={uploadInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(event) => {
              handleVideoUpload(event.target.files?.[0]);
              event.target.value = '';
            }}
          />
        </div>
      </div>

      {/* Calibration Sliders */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800 text-[11px]">
        <div>
          <div className="flex justify-between text-slate-400 mb-1">
            <span>Collision Threshold:</span>
            <span className="text-amber-400 font-bold">{collisionThreshold}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="90"
            step="1"
            value={collisionThreshold}
            onChange={(e) => setCollisionThreshold(Number(e.target.value))}
            className="w-full accent-amber-500 bg-slate-800 rounded h-1 cursor-pointer"
          />
        </div>

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
            <span>Frame Sampling:</span>
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
