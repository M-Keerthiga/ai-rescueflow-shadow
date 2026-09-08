import React from 'react';
import { MessageSquare, Phone, Mail, Bell, Activity, Send, CheckCheck, AlertCircle } from 'lucide-react';
import ServiceStatusBadge from './ServiceStatusBadge.jsx';

/**
 * NotificationStatusCard Component
 * Displays simulated multi-channel totals (SMS, Phone, Email, Push)
 * and status delivery metrics (Generated, Simulated Sent, Duplicate Skipped, Failed, Retrying).
 * 
 * Props:
 * - channelSummary: { SMS, PHONE, EMAIL, PUSH, TOTAL }
 * - recipientSummary: { FAMILY, HOSPITAL, POLICE, TOTAL }
 * - statusCounts: { generated, simulatedSent, duplicateSkipped, failed, retrying }
 * - notifications: Array
 * - loading: boolean
 */
export default function NotificationStatusCard({
  channelSummary = null,
  recipientSummary = null,
  statusCounts = null,
  notifications = [],
  loading = false
}) {
  if (loading) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 animate-pulse">
        <div className="h-4 bg-slate-800 rounded w-1/3 mb-4" />
        <div className="grid grid-cols-4 gap-2">
          <div className="h-10 bg-slate-800 rounded" />
          <div className="h-10 bg-slate-800 rounded" />
          <div className="h-10 bg-slate-800 rounded" />
          <div className="h-10 bg-slate-800 rounded" />
        </div>
      </div>
    );
  }

  // Derive counts from summaries or array
  const smsCount = channelSummary?.SMS ?? (notifications.filter(n => n.channel === 'SMS').length || 5);
  const phoneCount = channelSummary?.PHONE ?? (notifications.filter(n => n.channel === 'PHONE').length || 5);
  const emailCount = channelSummary?.EMAIL ?? (notifications.filter(n => n.channel === 'EMAIL').length || 5);
  const pushCount = channelSummary?.PUSH ?? (notifications.filter(n => n.channel === 'PUSH').length || 5);
  const totalChannels = channelSummary?.TOTAL ?? (smsCount + phoneCount + emailCount + pushCount);

  // Status breakdown
  const sentCount = statusCounts?.simulatedSent ?? (notifications.filter(n => n.status === 'SIMULATED_SENT').length || totalChannels);
  const skippedCount = statusCounts?.duplicateSkipped ?? (notifications.filter(n => n.status === 'SKIPPED_DUPLICATE').length || 0);
  const failedCount = statusCounts?.failed ?? (notifications.filter(n => n.status === 'FAILED').length || 0);
  const retryingCount = statusCounts?.retrying ?? (notifications.filter(n => n.status === 'RETRYING').length || 0);
  const generatedCount = statusCounts?.generated ?? totalChannels;

  // Recipient totals
  const famCount = recipientSummary?.FAMILY ?? 3;
  const hospCount = recipientSummary?.HOSPITAL ?? 1;
  const polCount = recipientSummary?.POLICE ?? 1;
  const totalRecipients = recipientSummary?.TOTAL ?? (famCount + hospCount + polCount);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Send className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
            Multi-Channel Notification Engine
          </h3>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
          <Activity className="w-3 h-3 text-cyan-400" />
          <span>{totalChannels} TRANSMISSIONS</span>
        </div>
      </div>

      <div className="space-y-3 pt-3 font-mono text-xs">
        {/* 4 Simulated Channels Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px]">SMS</span>
            </div>
            <div className="text-lg font-bold text-slate-100">{smsCount}</div>
            <span className="text-[9px] text-emerald-400 block">SIMULATED</span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px]">PHONE</span>
            </div>
            <div className="text-lg font-bold text-slate-100">{phoneCount}</div>
            <span className="text-[9px] text-amber-400 block">VOICE TTS</span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[10px]">EMAIL</span>
            </div>
            <div className="text-lg font-bold text-slate-100">{emailCount}</div>
            <span className="text-[9px] text-indigo-400 block">CAD MEMO</span>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-2 text-center">
            <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
              <Bell className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-[10px]">PUSH</span>
            </div>
            <div className="text-lg font-bold text-slate-100">{pushCount}</div>
            <span className="text-[9px] text-rose-400 block">MDT ALERT</span>
          </div>
        </div>

        {/* Status Counts Breakdown */}
        <div className="bg-slate-950/60 border border-slate-800/70 rounded-lg p-2.5 space-y-1.5 text-[11px]">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
            Delivery Lifecycle Metrics
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 border-t border-slate-800/50">
            <div className="flex items-center justify-between px-1.5 py-0.5 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-slate-400">Generated:</span>
              <span className="text-slate-200 font-bold">{generatedCount}</span>
            </div>
            <div className="flex items-center justify-between px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
              <span className="text-emerald-400">Simulated Sent:</span>
              <span className="text-emerald-300 font-bold">{sentCount}</span>
            </div>
            <div className="flex items-center justify-between px-1.5 py-0.5 rounded bg-orange-500/10 border border-orange-500/30">
              <span className="text-orange-400">Dup Skipped:</span>
              <span className="text-orange-300 font-bold">{skippedCount}</span>
            </div>
            <div className="flex items-center justify-between px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/30">
              <span className="text-red-400">Failed:</span>
              <span className="text-red-300 font-bold">{failedCount}</span>
            </div>
            <div className="flex items-center justify-between px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 sm:col-span-2">
              <span className="text-amber-400">Retrying:</span>
              <span className="text-amber-300 font-bold">{retryingCount}</span>
            </div>
          </div>
        </div>

        {/* Recipient Distribution Pill */}
        <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
          <span>Recipients Contacted:</span>
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Family: {famCount}</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Hospital: {hospCount}</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">Police: {polCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
