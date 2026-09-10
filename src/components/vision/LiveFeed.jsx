import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import VehicleOverlay from './VehicleOverlay.jsx';

export default function LiveFeed({ onVideoRef, onTimeUpdate }) {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const {
    inputMode,
    customVideoUrl,
    videoSeekTime,
    selectedClipData,
    setLiveVideoElement,
    runPredictionWorkflow,
    isPredictionRunning
  } = useApp();

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

  // Internal library and uploaded clips share the same player source
  const videoSrc = selectedClipData?.sourceUrl || customVideoUrl || '';

  useEffect(() => {
    if (videoRef.current) {
      if (setLiveVideoElement) setLiveVideoElement(videoRef.current);
      if (onVideoRef) onVideoRef(videoRef.current);
    }
  }, [onVideoRef, setLiveVideoElement]);

  // React to videoSeekTime change when user selects a video scenario
  useEffect(() => {
    if (videoRef.current && typeof videoSeekTime === 'number') {
      videoRef.current.currentTime = videoSeekTime;
      videoRef.current.play().catch(() => {});
    }
  }, [videoSeekTime, videoSrc]);

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

  // When video completes, execute prediction and navigate automatically
  const handleVideoEnded = () => {
    runPredictionWorkflow(navigate);
  };

  return (
    <div className="relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl group">
      <div className="relative w-full h-[460px] bg-slate-950 flex items-center justify-center overflow-hidden">
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
            playsInline
            muted
            onLoadedMetadata={handleLoadedMetadata}
            onCanPlay={handleCanPlay}
            onPlaying={handlePlaying}
            onPause={handlePause}
            onError={handleError}
            onTimeUpdate={handleTimeUpdateInternal}
            onEnded={handleVideoEnded}
            className="absolute inset-0 w-full h-full object-cover z-1"
          />
        )}

        {/* Dynamic HUD Overlays */}
        <VehicleOverlay />

        {/* Quick Trigger Floating Action */}
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
          <button
            onClick={() => runPredictionWorkflow(navigate)}
            disabled={isPredictionRunning}
            className="px-3 py-1.5 rounded-lg bg-navy-900/90 hover:bg-cyan-600/90 text-cyan-300 hover:text-white border border-cyan-500/40 text-[11px] font-mono font-bold flex items-center gap-1.5 backdrop-blur shadow-lg transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isPredictionRunning ? 'Predicting...' : 'Run Prediction'}</span>
          </button>
        </div>

        {/* Stream Status Bar */}
        <div className="absolute bottom-3 left-3 z-30 flex items-center gap-2 bg-slate-950/80 px-3 py-1 rounded-md border border-slate-800 text-[10px] font-mono backdrop-blur">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-300 font-bold uppercase">
            {selectedClipData?.scenarioId || 'FEED'}: {selectedClipData?.location || 'Live Feed'}
          </span>
          {videoState.duration > 0 && (
            <span className="text-slate-500 ml-1">
              ({videoState.currentTime.toFixed(1)}s / {videoState.duration.toFixed(1)}s)
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
