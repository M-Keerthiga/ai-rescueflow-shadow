import React, { useState, useEffect } from 'react';
import {
  Settings,
  ShieldAlert,
  RotateCcw,
  Save,
  CheckCircle2,
  Building,
  Radio,
  Sliders,
  Bell,
  Gauge,
  Clock
} from 'lucide-react';

export const DEFAULT_EMERGENCY_SETTINGS = {
  simulationMode: true,
  hospitalNotifications: true,
  policeNotifications: true,
  familyNotifications: true,
  maxRetries: 3,
  dispatchTimeoutSec: 30,
  simulationSpeed: '1x',
  defaultCity: 'San Francisco'
};

const STORAGE_KEY = 'RESCUEFLOW_EMERGENCY_SETTINGS';

/**
 * Loads stored settings from localStorage or defaults
 */
export function loadStoredEmergencySettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_EMERGENCY_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to parse stored emergency settings:', e);
  }
  return { ...DEFAULT_EMERGENCY_SETTINGS };
}

/**
 * EmergencySettingsPanel Component
 * Provides configuration for simulation channels, retries, timeouts, speed, and dynamically-loaded cities.
 * Persists to localStorage.
 */
export default function EmergencySettingsPanel({ onSave = null }) {
  const [settings, setSettings] = useState(loadStoredEmergencySettings);
  const [availableCities, setAvailableCities] = useState(['San Francisco']);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Dynamically load available demo cities from backend datasets (Policy Requirement)
  useEffect(() => {
    async function loadCities() {
      try {
        const res = await fetch('/api/emergency/services');
        if (res.ok) {
          const data = await res.json();
          const citySet = new Set();
          
          if (Array.isArray(data.hospitals)) {
            data.hospitals.forEach(h => { if (h.city) citySet.add(h.city); });
          }
          if (Array.isArray(data.policeStations)) {
            data.policeStations.forEach(p => { if (p.city) citySet.add(p.city); });
          }

          if (citySet.size > 0) {
            setAvailableCities(Array.from(citySet));
          }
        }
      } catch (e) {
        console.warn('Unable to dynamically load cities from backend, using current default city:', e);
      }
    }

    loadCities();
  }, []);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSavedSuccess(false);
  };

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setSavedSuccess(true);
      if (onSave) onSave(settings);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (e) {
      console.error('Failed to persist emergency settings:', e);
    }
  };

  const handleReset = () => {
    setSettings(DEFAULT_EMERGENCY_SETTINGS);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_EMERGENCY_SETTINGS));
      setSavedSuccess(true);
      if (onSave) onSave(DEFAULT_EMERGENCY_SETTINGS);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch (e) {
      console.error('Failed to reset emergency settings:', e);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm font-mono text-xs space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            EMERGENCY COORDINATION CONFIGURATION
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Persistent simulation policies, agency dispatches, retry thresholds, and city routing
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedSuccess && (
            <span className="flex items-center gap-1 text-emerald-400 font-bold text-[11px] animate-in fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              SETTINGS SAVED
            </span>
          )}

          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors text-[11px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSave}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-cyan-950/40 transition-all text-[11px]"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Group 1: Agency Channel Toggles */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
          <div className="text-slate-200 font-bold text-xs flex items-center gap-1.5 border-b border-slate-800/60 pb-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            <span>NOTIFICATION CHANNEL ROUTING</span>
          </div>

          <div className="space-y-2.5">
            {/* Simulation Mode Toggle (Always Enforced Notice) */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <div>
                <span className="text-slate-200 font-semibold block">Simulation Mode</span>
                <span className="text-[10px] text-amber-400 block">Strict zero-real-dispatch enforcement</span>
              </div>
              <input
                type="checkbox"
                checked={settings.simulationMode}
                onChange={(e) => handleChange('simulationMode', e.target.checked)}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Hospital Notifications */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <div>
                <span className="text-slate-200 font-semibold block">Hospital CAD Notifications</span>
                <span className="text-[10px] text-slate-400 block">Dispatch inbound trauma notifications</span>
              </div>
              <input
                type="checkbox"
                checked={settings.hospitalNotifications}
                onChange={(e) => handleChange('hospitalNotifications', e.target.checked)}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Police Notifications */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <div>
                <span className="text-slate-200 font-semibold block">Police Traffic Patrol Dispatch</span>
                <span className="text-[10px] text-slate-400 block">Dispatch perimeter lockdown alerts</span>
              </div>
              <input
                type="checkbox"
                checked={settings.policeNotifications}
                onChange={(e) => handleChange('policeNotifications', e.target.checked)}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Family Notifications */}
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/80 border border-slate-800">
              <div>
                <span className="text-slate-200 font-semibold block">Family Emergency Advisory</span>
                <span className="text-[10px] text-slate-400 block">Send deduplicated advisory to contacts</span>
              </div>
              <input
                type="checkbox"
                checked={settings.familyNotifications}
                onChange={(e) => handleChange('familyNotifications', e.target.checked)}
                className="w-4 h-4 accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Group 2: Operational Controls & Dynamic City */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-3">
          <div className="text-slate-200 font-bold text-xs flex items-center gap-1.5 border-b border-slate-800/60 pb-2">
            <Gauge className="w-4 h-4 text-amber-400" />
            <span>OPERATIONAL PARAMETERS & GEOGRAPHY</span>
          </div>

          <div className="space-y-3">
            {/* Maximum Retries */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Maximum Notification Retries</span>
                <span className="text-cyan-400 font-bold">{settings.maxRetries} Retries</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={settings.maxRetries}
                onChange={(e) => handleChange('maxRetries', Number(e.target.value))}
                className="w-full accent-cyan-500 bg-slate-800 rounded h-1.5 cursor-pointer"
              />
            </div>

            {/* Dispatch Timeout */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Dispatch Timeout</span>
                <span className="text-amber-400 font-bold">{settings.dispatchTimeoutSec} Seconds</span>
              </div>
              <input
                type="range"
                min="10"
                max="120"
                step="5"
                value={settings.dispatchTimeoutSec}
                onChange={(e) => handleChange('dispatchTimeoutSec', Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded h-1.5 cursor-pointer"
              />
            </div>

            {/* Simulation Speed */}
            <div>
              <span className="text-slate-300 block mb-1">Simulation Clock Speed</span>
              <select
                value={settings.simulationSpeed}
                onChange={(e) => handleChange('simulationSpeed', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
              >
                <option value="0.5x">0.5x (Slow-Motion Review)</option>
                <option value="1x">1.0x (Standard Simulation)</option>
                <option value="2x">2.0x (Accelerated Demo)</option>
                <option value="5x">5.0x (Fast CAD Replay)</option>
                <option value="Realtime">Realtime Operational (1:1)</option>
              </select>
            </div>

            {/* Default City (Dynamically loaded from backend datasets) */}
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Default Geographic City</span>
                <span className="text-emerald-400 text-[10px]">DYNAMICALLY LOADED</span>
              </div>
              <select
                value={settings.defaultCity}
                onChange={(e) => handleChange('defaultCity', e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
              >
                {availableCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
