import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  AlertOctagon,
  Send,
  RefreshCw,
  Server,
  AlertTriangle,
  Clock,
  Radio,
  Sparkles,
  Info,
  Layers,
  FileText,
  Sliders,
  Activity
} from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import { DEMO_EMERGENCY_DATA, SIMULATION_DISCLAIMER } from '../../data/emergencyDemoData.js';
import ServiceStatusBadge from './ServiceStatusBadge.jsx';
import IncidentLocationCard from './IncidentLocationCard.jsx';
import NearbyServicesCard from './NearbyServicesCard.jsx';
import DispatchSummaryCard from './DispatchSummaryCard.jsx';
import NotificationStatusCard from './NotificationStatusCard.jsx';
import FamilyContactsCard from './FamilyContactsCard.jsx';
import DispatchTimeline from './DispatchTimeline.jsx';
import NotificationLog from './NotificationLog.jsx';
import EmergencySettingsPanel from './EmergencySettingsPanel.jsx';

/**
 * EmergencyCoordinatorPanel Component
 * Master Emergency Coordination Dashboard embedded inside Operational Command Center.
 * 
 * Strict Policies Enforced:
 * 1. Data Source Policy: Live API primary + Demo Simulation Data fallback with badge
 * 2. Permanent Simulation Notice: "SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED"
 * 3. Polling Policy: 2-second polling while ACTIVE; auto-stops on COMPLETED or FAILED; single interval guarantee
 * 4. API Request Policy: in-flight request lock & stale response drop
 * 5. Error Handling: inline alert + retain last-known data; never crashes
 * 6. State Management: integrated with useApp() / AppContext
 */
export default function EmergencyCoordinatorPanel() {
  const { activeIncident, riskResult, triggerCollisionSimulation } = useApp();

  // Panel collapse toggle (expanded by default)
  const [isExpanded, setIsExpanded] = useState(true);

  // Tab navigation state: 'overview' | 'timeline' | 'log' | 'settings'
  const [activeTab, setActiveTab] = useState('overview');

  // Active data state (retains last good data)
  const [emergencyData, setEmergencyData] = useState(DEMO_EMERGENCY_DATA);
  const [allNotifications, setAllNotifications] = useState([]);
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isActionRunning, setIsActionRunning] = useState(false);
  const [inlineError, setInlineError] = useState(null);

  // Request & Polling guards (Policy 2 & 3)
  const isPendingRef = useRef(false);
  const requestSeqRef = useRef(0);
  const pollIntervalRef = useRef(null);

  /**
   * Fetches latest emergency status and history from backend API.
   * Drops stale responses and prevents duplicate concurrent in-flight requests.
   */
  const fetchEmergencyStatus = useCallback(async (incidentId) => {
    if (!incidentId) return;
    if (isPendingRef.current) return; // Prevent duplicate concurrent requests

    isPendingRef.current = true;
    const currentSeq = ++requestSeqRef.current;

    try {
      const [statusRes, histRes] = await Promise.all([
        fetch(`/api/emergency/status/${incidentId}`),
        fetch('/api/emergency/history')
      ]);

      // Drop stale response if a newer request was dispatched
      if (currentSeq !== requestSeqRef.current) return;

      if (statusRes.ok) {
        const data = await statusRes.json();
        if (data.found) {
          // Construct clean live payload (never mix with demo)
          setEmergencyData((prev) => ({
            incidentId: data.incidentId,
            severity: data.severity || 'CRITICAL',
            incidentStatus: data.incidentStatus || 'COMPLETED',
            dispatchStatus: data.dispatchStatus || 'ALL_CHANNELS_DISPATCHED_SIMULATED',
            currentStatus: data.currentStatus || 'SIMULATED_SENT',
            responsePriority: prev.responsePriority || 'Highest Priority',
            location: {
              GPS: data.gps || '37.774900, -122.419400',
              roadName: data.vehicle ? `Collision Site (${data.vehicle})` : 'Market Street Urban Transit Corridor',
              nearestCity: 'San Francisco',
              confidence: 0.98,
              coordinates: { latitude: 37.7749, longitude: -122.4194 }
            },
            selectedHospital: prev.selectedHospital,
            selectedPoliceStation: prev.selectedPoliceStation,
            familyRecipients: data.recipients?.filter(r => r.recipientType === 'FAMILY') || prev.familyRecipients,
            channelSummary: data.channelSummary || prev.channelSummary,
            recipientSummary: data.recipientSummary || prev.recipientSummary,
            notifications: data.notifications || [],
            timeline: data.timeline || []
          }));

          if (histRes.ok) {
            const histData = await histRes.json();
            if (Array.isArray(histData.notificationHistory)) {
              setAllNotifications(histData.notificationHistory);
            }
          }

          setIsLiveMode(true);
          setInlineError(null);
        }
      } else {
        throw new Error(`API responded with status ${statusRes.status}`);
      }
    } catch (err) {
      console.warn('Live API request failed, retaining last valid data and switching to demo fallback indicator:', err);
      setIsLiveMode(false);
      setInlineError('Backend API unreachable. Displaying resilient simulation data.');
    } finally {
      isPendingRef.current = false;
    }
  }, []);

  /**
   * Initial data load: fetch services directory and history
   */
  useEffect(() => {
    let isMounted = true;

    async function initData() {
      setIsLoading(true);
      try {
        const [srvRes, histRes] = await Promise.all([
          fetch('/api/emergency/services'),
          fetch('/api/emergency/history')
        ]);

        if (srvRes.ok && isMounted) {
          const srvData = await srvRes.json();
          let liveHosp = null;
          let livePol = null;

          if (srvData.hospitals?.length > 0) {
            liveHosp = srvData.hospitals[0];
          }
          if (srvData.policeStations?.length > 0) {
            livePol = srvData.policeStations[0];
          }

          setEmergencyData((prev) => ({
            ...prev,
            selectedHospital: liveHosp || prev.selectedHospital,
            selectedPoliceStation: livePol || prev.selectedPoliceStation
          }));

          if (histRes.ok) {
            const histData = await histRes.json();
            if (Array.isArray(histData.notificationHistory) && histData.notificationHistory.length > 0) {
              setAllNotifications(histData.notificationHistory);
            }
          }

          setIsLiveMode(true);
          setInlineError(null);
        } else {
          throw new Error('Services API response not ok');
        }
      } catch {
        if (isMounted) {
          setIsLiveMode(false);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    initData();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Synchronize with active incident from AppContext
   */
  useEffect(() => {
    if (activeIncident?.id) {
      setEmergencyData((prev) => ({
        ...prev,
        incidentId: activeIncident.id,
        severity: activeIncident.severity_level || activeIncident.severity?.level || prev.severity,
        incidentStatus: 'ACTIVE',
        dispatchStatus: 'SIMULATED_DISPATCHED'
      }));
      fetchEmergencyStatus(activeIncident.id);
    }
  }, [activeIncident, fetchEmergencyStatus]);

  /**
   * Polling Policy:
   * - Poll every 2 seconds ONLY while incident is ACTIVE.
   * - Automatically stop polling when COMPLETED or FAILED.
   * - Clean up when component unmounts.
   * - Exactly ONE polling interval exists at any time.
   */
  useEffect(() => {
    const isIncidentActive =
      emergencyData?.incidentStatus === 'ACTIVE' ||
      emergencyData?.currentStatus === 'ACTIVE' ||
      emergencyData?.dispatchStatus === 'IN_PROGRESS';

    // Clear existing interval to guarantee single interval
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }

    if (isIncidentActive && emergencyData?.incidentId) {
      pollIntervalRef.current = setInterval(() => {
        fetchEmergencyStatus(emergencyData.incidentId);
      }, 2000);
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
        pollIntervalRef.current = null;
      }
    };
  }, [emergencyData?.incidentStatus, emergencyData?.currentStatus, emergencyData?.dispatchStatus, emergencyData?.incidentId, fetchEmergencyStatus]);

  /**
   * Action: Orchestrate Emergency Response
   */
  const handleOrchestrate = async () => {
    if (isActionRunning) return;
    setIsActionRunning(true);
    setInlineError(null);

    const payload = {
      incidentId: emergencyData?.incidentId || `INC-SIM-${Date.now().toString().slice(-6)}`,
      isCollisionConfirmed: true,
      severity: riskResult?.category || emergencyData?.severity || 'CRITICAL',
      latitude: emergencyData?.location?.coordinates?.latitude || 37.7749,
      longitude: emergencyData?.location?.coordinates?.longitude || -122.4194
    };

    try {
      const res = await fetch('/api/emergency/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setEmergencyData({
          incidentId: data.incidentId,
          severity: data.severity,
          responsePriority: data.responsePriority,
          selectedHospital: data.selectedHospital,
          selectedPoliceStation: data.selectedPoliceStation,
          familyRecipients: data.familyRecipients || [],
          dispatchPlan: data.dispatchPlan || [],
          timeline: data.timeline || [],
          location: data.location || {
            GPS: `${payload.latitude}, ${payload.longitude}`,
            roadName: 'Market Street Urban Transit Corridor',
            nearestCity: 'San Francisco',
            confidence: 0.98
          },
          channelSummary: { SMS: 0, PHONE: 0, EMAIL: 0, PUSH: 0, TOTAL: 0 },
          recipientSummary: { FAMILY: data.familyRecipients?.length || 3, HOSPITAL: 1, POLICE: 1, TOTAL: 5 },
          incidentStatus: 'ORCHESTRATED',
          dispatchStatus: 'DISPATCH_PLANNED',
          currentStatus: 'READY'
        });
        setIsLiveMode(true);
      } else {
        throw new Error('Orchestrate returned non-200');
      }
    } catch {
      setIsLiveMode(false);
      setEmergencyData((prev) => ({
        ...prev,
        incidentStatus: 'ORCHESTRATED',
        dispatchStatus: 'DISPATCH_PLANNED'
      }));
    } finally {
      setIsActionRunning(false);
    }
  };

  /**
   * Action: Dispatch Multi-Channel Notifications
   */
  const handleDispatchNotifications = async () => {
    if (isActionRunning) return;
    setIsActionRunning(true);
    setInlineError(null);

    const payload = {
      incidentId: emergencyData?.incidentId || `INC-SIM-${Date.now().toString().slice(-6)}`,
      isCollisionConfirmed: true,
      severity: emergencyData?.severity || 'CRITICAL',
      latitude: emergencyData?.location?.coordinates?.latitude || 37.7749,
      longitude: emergencyData?.location?.coordinates?.longitude || -122.4194,
      vehicle: 'BUS #7 (College Bus) & CAR #12 (Ola Sedan)'
    };

    try {
      const res = await fetch('/api/emergency/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setEmergencyData((prev) => ({
          ...prev,
          incidentId: data.incidentId,
          severity: data.severity,
          incidentStatus: data.incidentStatus || 'COMPLETED',
          dispatchStatus: data.dispatchStatus,
          currentStatus: data.currentStatus,
          channelSummary: data.channelSummary || prev.channelSummary,
          recipientSummary: data.recipientSummary || prev.recipientSummary,
          notifications: data.notifications || prev.notifications,
          timeline: data.timeline || prev.timeline
        }));

        if (Array.isArray(data.notifications)) {
          setAllNotifications((prev) => [...data.notifications, ...prev]);
        }
        setIsLiveMode(true);
      } else {
        throw new Error('Notify returned non-200');
      }
    } catch {
      setIsLiveMode(false);
      setEmergencyData((prev) => ({
        ...prev,
        incidentStatus: 'COMPLETED',
        dispatchStatus: 'ALL_CHANNELS_DISPATCHED_SIMULATED',
        currentStatus: 'SIMULATED_SENT'
      }));
    } finally {
      setIsActionRunning(false);
    }
  };

  return (
    <section
      aria-label="Emergency Coordination Dashboard"
      className="bg-navy-900 border border-slate-800 rounded-2xl shadow-lg transition-all overflow-hidden"
    >
      {/* Permanent Simulation Notice Banner (Policy Requirement) */}
      <div
        role="alert"
        className="bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between flex-wrap gap-2 text-xs font-mono"
      >
        <div className="flex items-center gap-2 text-amber-300 font-bold">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 animate-pulse" />
          <span className="tracking-wide uppercase">
            SIMULATION — NO REAL EMERGENCY SERVICES CONTACTED
          </span>
        </div>
        <div className="flex items-center gap-2">
          {/* Data Source Badge (Policy 1) */}
          {isLiveMode ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
              <Server className="w-3 h-3 text-emerald-400" />
              <span>LIVE BACKEND DATA</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>DEMO SIMULATION DATA</span>
            </span>
          )}
        </div>
      </div>

      {/* Collapsible Header */}
      <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            aria-label="Toggle Emergency Coordination Dashboard Section"
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-500"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-slate-100 font-mono tracking-tight flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-cyan-400" />
                EMERGENCY COORDINATION
              </h2>

              <ServiceStatusBadge
                status={emergencyData?.incidentStatus || 'READY'}
                size="sm"
              />

              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {emergencyData?.incidentId ? `INCIDENT #${emergencyData.incidentId}` : 'NO ACTIVE INCIDENT'}
              </span>
            </div>

            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Deterministic Multi-Agency Response Orchestration, 10-Step Timeline, Searchable Log & Persistent Settings
            </p>
          </div>
        </div>

        {/* Quick Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleOrchestrate}
            disabled={isActionRunning}
            aria-label="Orchestrate Emergency Response"
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
          >
            <Radio className={`w-3.5 h-3.5 text-cyan-400 ${isActionRunning ? 'animate-spin' : ''}`} />
            <span>ORCHESTRATE</span>
          </button>

          <button
            onClick={handleDispatchNotifications}
            disabled={isActionRunning}
            aria-label="Dispatch Multi-Channel Simulated Notifications"
            className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-400/40 flex items-center gap-1.5 shadow-md shadow-cyan-950/40 transition-all disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5 fill-current" />
            <span>DISPATCH NOTIFICATIONS</span>
          </button>

          <button
            onClick={() => fetchEmergencyStatus(emergencyData?.incidentId)}
            disabled={isLoading || isPendingRef.current}
            aria-label="Refresh Emergency Status"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors disabled:opacity-50"
            title="Refresh status"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Tab Navigation Controls */}
      {isExpanded && (
        <div className="flex items-center gap-2 px-4 sm:px-6 pt-3 pb-2 border-b border-slate-800/60 bg-slate-950/30 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'overview'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'timeline'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>10-Stage Timeline</span>
          </button>

          <button
            onClick={() => setActiveTab('log')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'log'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Notification Log</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
              activeTab === 'settings'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Emergency Settings</span>
          </button>
        </div>
      )}

      {/* Inline Warning Notice if API Error occurred (Policy 4) */}
      {inlineError && (
        <div className="px-5 py-2 bg-red-500/10 border-b border-red-500/20 text-red-300 text-xs font-mono flex items-center gap-2">
          <Info className="w-4 h-4 flex-shrink-0" />
          <span>{inlineError}</span>
        </div>
      )}

      {/* Collapsible Content Panels */}
      {isExpanded && (
        <div className="p-4 sm:p-6 space-y-4 animate-in fade-in duration-200">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* Top Row: Location, Nearby Services, Dispatch Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <IncidentLocationCard
                  location={emergencyData?.location}
                  loading={isLoading}
                />

                <NearbyServicesCard
                  hospital={emergencyData?.selectedHospital}
                  policeStation={emergencyData?.selectedPoliceStation}
                  loading={isLoading}
                />

                <DispatchSummaryCard
                  dispatchPlan={emergencyData?.dispatchPlan}
                  severity={emergencyData?.severity}
                  responsePriority={emergencyData?.responsePriority}
                  selectedHospital={emergencyData?.selectedHospital}
                  selectedPoliceStation={emergencyData?.selectedPoliceStation}
                  currentStage={emergencyData?.timeline?.[emergencyData.timeline.length - 1]?.stage}
                  loading={isLoading}
                />
              </div>

              {/* Bottom Row: Multi-Channel Notification Totals & Family Contacts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <NotificationStatusCard
                  channelSummary={emergencyData?.channelSummary}
                  recipientSummary={emergencyData?.recipientSummary}
                  statusCounts={emergencyData?.statusCounts}
                  notifications={emergencyData?.notifications}
                  loading={isLoading}
                />

                <FamilyContactsCard
                  familyContacts={emergencyData?.familyRecipients}
                  loading={isLoading}
                />
              </div>
            </div>
          )}

          {/* TAB 2: 10-STAGE TIMELINE */}
          {activeTab === 'timeline' && (
            <DispatchTimeline
              timeline={emergencyData?.timeline}
              incidentContext={emergencyData}
              loading={isLoading}
            />
          )}

          {/* TAB 3: SEARCHABLE NOTIFICATION LOG */}
          {activeTab === 'log' && (
            <NotificationLog
              notifications={allNotifications.length > 0 ? allNotifications : emergencyData?.notifications}
              loading={isLoading}
              onRefresh={() => fetchEmergencyStatus(emergencyData?.incidentId)}
            />
          )}

          {/* TAB 4: PERSISTENT EMERGENCY SETTINGS */}
          {activeTab === 'settings' && (
            <EmergencySettingsPanel />
          )}
        </div>
      )}
    </section>
  );
}
