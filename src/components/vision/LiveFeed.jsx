import React, { useRef, useEffect, useState } from 'react';
import { Video, ShieldAlert, Wifi, Info, AlertTriangle, Play, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import VehicleOverlay from './VehicleOverlay.jsx';
import DetectionStatus from './DetectionStatus.jsx';

export default function LiveFeed({ onVideoRef, onTimeUpdate }) {
  const videoRef = useRef(null);
  const { inputMode, customVideoUrl, visionStatus, videoSeekTime, selectedClipData } = useApp();

  const [videoState, setVideoState] = useState({
    status: 'LOADING', // LOADING, READY, PLAYING, PAUSED, ERROR
    duration: 0,
    currentTime: 0,
    videoWidth: 0,
    videoHeight: 0,
    error: null,
    readyState: 0,
    networkState: 0
  });

  const [showDebug, setShowDebug] = useState(false);

  // Video URL selection: priority to customVideoUrl, default to master-demo.mp4
  const videoSrc = customVideoUrl || "/demo/master-demo.mp4";

  useEffect(() => {
    if (onVideoRef && videoRef.current) {
      onVideoRef(videoRef.current);
    }
  }, [onVideoRef]);

  // React to videoSeekTime change when user selects a video scenario
  useEffect(() => {
    if (videoRef.current && typeof videoSeekTime === 'number') {
      videoRef.current.currentTime = videoSeekTime;
      videoRef.current.play().catch(() => {});
    }
  }, [videoSeekTime]);

  useEffect(() => {
    if (inputMode === 'webcam') {
      navigator.mediaDevices?.getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(() => {});
            setVideoState((prev) => ({ ...prev, status: 'PLAYING' }));
          }
        })
        .catch((err) => {
          console.warn('Webcam unfulfilled, fallback to demo video:', err);
          setVideoState((prev) => ({ ...prev, status: 'ERROR', error: err.message }));
        });
    }
  }, [inputMode]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoState((prev) => ({
        ...prev,
        status: 'READY',
        duration: videoRef.current.duration || 0,
        videoWidth: videoRef.current.videoWidth || 1280,
        videoHeight: videoRef.current.videoHeight || 720,
        readyState: videoRef.current.readyState,
        networkState: videoRef.current.networkState
      }));
    }
  };

  const handleCanPlay = () => {
    setVideoState((prev) => ({
      ...prev,
      status: prev.status === 'PLAYING' ? 'PLAYING' : 'READY',
      readyState: videoRef.current?.readyState || 4
    }));
  };

  const handlePlaying = () => {
    setVideoState((prev) => ({ ...prev, status: 'PLAYING' }));
  };

  const handlePause = () => {
    setVideoState((prev) => ({ ...prev, status: 'PAUSED' }));
  };

  const handleError = (e) => {
    const errMessage = videoRef.current?.error?.message || "Failed to load video file at " + videoSrc;
    console.error("Video element error:", errMessage, e);
    setVideoState((prev) => ({
      ...prev,
      status: 'ERROR',
      error: errMessage
    }));
  };

  const handleTimeUpdateInternal = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime || 0;
      setVideoState((prev) => ({ ...prev, currentTime: cur }));
      if (onTimeUpdate) {
        onTimeUpdate(cur);
      }
    }
  };

  return (
    <div className="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl group font-mono">
      {/* Top Overlay HUD Bar */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-30 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto flex-wrap">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-bold animate-pulse">
            <Wifi className="w-3.5 h-3.5" />
            LIVE FEED
          </span>

          <DetectionStatus />

          {/* Active 28-Clip Tag */}
          {selectedClipData && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              {selectedClipData.clipId}: {selectedClipData.scenario}
            </span>
          )}

          {/* Model / Telemetry Mode Badge */}
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            MODE: {visionStatus?.modelStatus || 'DEMO TELEMETRY'}
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Debug Info Toggle Button */}
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="bg-navy-950/80 backdrop-blur px-2 py-1 rounded border border-slate-800 text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-1"
            title="Toggle Video Debug Info"
          >
            <Info className="w-3 h-3 text-cyan-400" />
            DEBUG
          </button>

          <div className="bg-navy-950/80 backdrop-blur px-2.5 py-1 rounded border border-slate-800 text-[11px] text-cyan-300 font-bold">
            {selectedClipData?.location ? `📍 ${selectedClipData.location}` : 'CAM-04 (URBAN INTERSECTION)'}
          </div>
        </div>
      </div>

      {/* Main Video Viewport Container */}
      <div className="relative w-full h-[400px] bg-slate-950 flex items-center justify-center overflow-hidden">
        {/* Layer 1: ACTUAL MP4 VIDEO ELEMENT */}
        {inputMode === 'webcam' ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="absolute inset-0 w-full h-full object-cover z-1"
          />
        ) : (
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            onLoadedMetadata={handleLoadedMetadata}
            onCanPlay={handleCanPlay}
            onPlaying={handlePlaying}
            onPause={handlePause}
            onError={handleError}
            onTimeUpdate={handleTimeUpdateInternal}
            className="absolute inset-0 w-full h-full object-cover z-1"
          />
        )}

        {/* Video Load Error Overlay Box */}
        {videoState.status === 'ERROR' && (
          <div className="absolute inset-0 z-40 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-3">
            <AlertTriangle className="w-12 h-12 text-red-500 animate-bounce" />
            <div className="text-sm font-bold text-red-400">VIDEO SOURCE ERROR</div>
            <div className="text-xs text-slate-300 bg-red-950/50 border border-red-800 px-3 py-1.5 rounded font-mono">
              Path: {videoSrc}
            </div>
            <p className="text-[11px] text-slate-400 max-w-md">
              Ensure master-demo.mp4 is available in public/demo/ directory. Controlled AI Telemetry remains active.
            </p>
          </div>
        )}

        {/* Debug Panel Modal Overlay */}
        {showDebug && (
          <div className="absolute top-14 left-4 z-40 bg-slate-950/95 border border-cyan-500/40 p-3.5 rounded-xl shadow-2xl text-[10px] space-y-1 text-slate-300 backdrop-blur max-w-xs font-mono">
            <div className="font-bold text-cyan-400 border-b border-slate-800 pb-1 mb-1">VIDEO DIAGNOSTIC PANEL</div>
            <div>URL: <strong className="text-white">{videoSrc}</strong></div>
            <div>Resolution: <strong className="text-white">{videoState.videoWidth}x{videoState.videoHeight}</strong></div>
            <div>Duration: <strong className="text-white">{Number(videoState?.duration || 0).toFixed(1)}s</strong></div>
            <div>Current Time: <strong className="text-cyan-300">{Number(videoState?.currentTime || 0).toFixed(1)}s</strong></div>
            <div>Status: <strong className="text-emerald-400">{videoState.status}</strong></div>
            <div>Ready State: <strong className="text-slate-200">{videoState.readyState}</strong></div>
            <div>Network State: <strong className="text-slate-200">{videoState.networkState}</strong></div>
          </div>
        )}

        {/* Layer 2: Live Bounding Box, Trajectory & Conflict Node Overlay */}
        <VehicleOverlay />
      </div>

      {/* Bottom Camera Telemetry & Diagnostic Strip */}
      <div className="bg-navy-900 border-t border-slate-800 p-2.5 px-4 text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span>Resolution: {videoState.videoWidth || 1280}x{videoState.videoHeight || 720} @ 30 FPS</span>
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            VIDEO: {videoState.status}
          </span>
        </div>
        <div>Calibration: Optical Homography Matrix Active (H_inv)</div>
        <div className="text-cyan-400 font-bold">Targets: Bus #7 & Car #12</div>
      </div>
    </div>
  );
}
