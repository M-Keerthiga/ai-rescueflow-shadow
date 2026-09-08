import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  MessageSquare,
  Phone,
  Mail,
  Bell,
  Send,
  RefreshCw,
  FileText,
  User,
  Hospital,
  Shield
} from 'lucide-react';
import ServiceStatusBadge from './ServiceStatusBadge.jsx';

/**
 * NotificationLog Component
 * Searchable and filterable notification audit table.
 * 
 * Props:
 * - notifications: Array of notification objects
 * - loading: boolean
 * - onRefresh: function (optional)
 */
export default function NotificationLog({ notifications = [], loading = false, onRefresh = null }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipientType, setSelectedRecipientType] = useState('ALL');
  const [selectedChannel, setSelectedChannel] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Fallback demo notifications if list is empty
  const rawList = notifications.length > 0 ? notifications : [
    {
      notificationId: 'NOTIF-000001',
      incidentId: 'INC-SIM-DEMO-8841',
      recipientName: 'Sarah Jenkins',
      recipientType: 'FAMILY',
      channel: 'SMS',
      status: 'SIMULATED_SENT',
      retryCount: 1,
      timestamp: new Date(Date.now() - 60000).toISOString()
    },
    {
      notificationId: 'NOTIF-000002',
      incidentId: 'INC-SIM-DEMO-8841',
      recipientName: 'Sarah Jenkins',
      recipientType: 'FAMILY',
      channel: 'PHONE',
      status: 'SIMULATED_SENT',
      retryCount: 1,
      timestamp: new Date(Date.now() - 59000).toISOString()
    },
    {
      notificationId: 'NOTIF-000003',
      incidentId: 'INC-SIM-DEMO-8841',
      recipientName: 'Sarah Jenkins',
      recipientType: 'FAMILY',
      channel: 'EMAIL',
      status: 'SIMULATED_SENT',
      retryCount: 1,
      timestamp: new Date(Date.now() - 58000).toISOString()
    },
    {
      notificationId: 'NOTIF-000004',
      incidentId: 'INC-SIM-DEMO-8841',
      recipientName: 'Sarah Jenkins',
      recipientType: 'FAMILY',
      channel: 'PUSH',
      status: 'SIMULATED_SENT',
      retryCount: 1,
      timestamp: new Date(Date.now() - 57000).toISOString()
    },
    {
      notificationId: 'NOTIF-000005',
      incidentId: 'INC-SIM-DEMO-8841',
      recipientName: 'Metro General & Trauma Hospital',
      recipientType: 'HOSPITAL',
      channel: 'SMS',
      status: 'SIMULATED_SENT',
      retryCount: 1,
      timestamp: new Date(Date.now() - 50000).toISOString()
    },
    {
      notificationId: 'NOTIF-000006',
      incidentId: 'INC-SIM-DEMO-8841',
      recipientName: 'SFPD Central Traffic Division',
      recipientType: 'POLICE',
      channel: 'SMS',
      status: 'SIMULATED_SENT',
      retryCount: 1,
      timestamp: new Date(Date.now() - 48000).toISOString()
    },
    {
      notificationId: 'NOTIF-000007',
      incidentId: 'INC-SIM-DEMO-8841',
      recipientName: 'David Jenkins Sr.',
      recipientType: 'FAMILY',
      channel: 'SMS',
      status: 'SKIPPED_DUPLICATE',
      retryCount: 2,
      timestamp: new Date(Date.now() - 40000).toISOString()
    }
  ];

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return rawList.filter((notif) => {
      const matchSearch =
        searchTerm === '' ||
        (notif.notificationId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (notif.incidentId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (notif.recipientName || notif.recipientId || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchType =
        selectedRecipientType === 'ALL' ||
        (notif.recipientType || '').toUpperCase() === selectedRecipientType;

      const matchChannel =
        selectedChannel === 'ALL' ||
        (notif.channel || '').toUpperCase() === selectedChannel;

      const matchStatus =
        selectedStatus === 'ALL' ||
        (notif.status || '').toUpperCase() === selectedStatus;

      return matchSearch && matchType && matchChannel && matchStatus;
    });
  }, [rawList, searchTerm, selectedRecipientType, selectedChannel, selectedStatus]);

  const getChannelIcon = (channel) => {
    switch (String(channel).toUpperCase()) {
      case 'SMS':
        return <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />;
      case 'PHONE':
        return <Phone className="w-3.5 h-3.5 text-amber-400" />;
      case 'EMAIL':
        return <Mail className="w-3.5 h-3.5 text-indigo-400" />;
      case 'PUSH':
        return <Bell className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <Send className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getRecipientIcon = (type) => {
    switch (String(type).toUpperCase()) {
      case 'FAMILY':
        return <User className="w-3.5 h-3.5 text-cyan-400" />;
      case 'HOSPITAL':
        return <Hospital className="w-3.5 h-3.5 text-emerald-400" />;
      case 'POLICE':
        return <Shield className="w-3.5 h-3.5 text-indigo-400" />;
      default:
        return <User className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm font-mono text-xs space-y-4">
      {/* Header & Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            NOTIFICATION AUDIT LOG
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Simulated Multi-Channel Delivery Records & Anti-Spam Deduplication Traces
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Refresh log"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 font-bold text-[11px]">
            {filteredNotifications.length} of {rawList.length} Records
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search ID or Recipient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Recipient Type Filter */}
        <select
          value={selectedRecipientType}
          onChange={(e) => setSelectedRecipientType(e.target.value)}
          className="bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
        >
          <option value="ALL">All Recipient Types</option>
          <option value="FAMILY">Family Contacts</option>
          <option value="HOSPITAL">Hospital Intake</option>
          <option value="POLICE">Police Stations</option>
        </select>

        {/* Channel Filter */}
        <select
          value={selectedChannel}
          onChange={(e) => setSelectedChannel(e.target.value)}
          className="bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
        >
          <option value="ALL">All Channels</option>
          <option value="SMS">SMS Text</option>
          <option value="PHONE">Phone (Voice TTS)</option>
          <option value="EMAIL">Email (CAD Memo)</option>
          <option value="PUSH">Push Notification</option>
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-slate-950/80 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
        >
          <option value="ALL">All Statuses</option>
          <option value="SIMULATED_SENT">Simulated Sent</option>
          <option value="SKIPPED_DUPLICATE">Skipped Duplicate</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      {/* Log Table */}
      <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/60">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/80 text-[10px] text-slate-400 uppercase tracking-wider">
              <th className="p-2.5">Notification ID</th>
              <th className="p-2.5">Incident ID</th>
              <th className="p-2.5">Recipient</th>
              <th className="p-2.5">Type</th>
              <th className="p-2.5">Channel</th>
              <th className="p-2.5">Status</th>
              <th className="p-2.5 text-center">Retries</th>
              <th className="p-2.5 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-[11px]">
            {filteredNotifications.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-slate-500">
                  No matching notification records found.
                </td>
              </tr>
            ) : (
              filteredNotifications.map((n, idx) => (
                <tr key={n.notificationId || idx} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-2.5 font-bold text-cyan-400 select-all">
                    {n.notificationId || `NOTIF-${String(idx + 1).padStart(6, '0')}`}
                  </td>
                  <td className="p-2.5 text-slate-300 font-semibold">
                    {n.incidentId}
                  </td>
                  <td className="p-2.5 text-slate-100 font-medium truncate max-w-[180px]" title={n.recipientName || n.recipientId}>
                    {n.recipientName || n.recipientId || 'Recipient'}
                  </td>
                  <td className="p-2.5">
                    <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-slate-300">
                      {getRecipientIcon(n.recipientType)}
                      <span>{n.recipientType}</span>
                    </span>
                  </td>
                  <td className="p-2.5">
                    <span className="inline-flex items-center gap-1 font-semibold text-slate-200">
                      {getChannelIcon(n.channel)}
                      <span>{n.channel}</span>
                    </span>
                  </td>
                  <td className="p-2.5">
                    <ServiceStatusBadge status={n.status} size="sm" />
                  </td>
                  <td className="p-2.5 text-center font-bold text-slate-300">
                    {n.retryCount || 1}
                  </td>
                  <td className="p-2.5 text-right text-slate-400 select-all">
                    {new Date(n.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
