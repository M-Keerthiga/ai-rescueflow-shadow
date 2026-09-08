import React from 'react';
import { BarChart3, TrendingUp, ShieldCheck, Ambulance, AlertOctagon } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { useApp } from '../context/AppContext.jsx';

export default function Analytics() {
  const { analyticsData } = useApp();

  const severityData = analyticsData?.severityChartData || [
    { name: 'LOW', count: 2 },
    { name: 'MEDIUM', count: 5 },
    { name: 'CRITICAL', count: 8 },
    { name: 'CATASTROPHIC', count: 1 }
  ];

  const riskDistribution = analyticsData?.riskDistributionData || [
    { category: 'SAFE', count: 18 },
    { category: 'CAUTION', count: 14 },
    { category: 'HIGH', count: 12 },
    { category: 'CRITICAL', count: 9 }
  ];

  const responseTrend = analyticsData?.responseTimeData || [
    { month: 'Jan', avgMinutes: 5.4, target: 5.0 },
    { month: 'Feb', avgMinutes: 4.9, target: 5.0 },
    { month: 'Mar', avgMinutes: 4.6, target: 5.0 },
    { month: 'Apr', avgMinutes: 4.2, target: 5.0 },
    { month: 'May', avgMinutes: 3.8, target: 5.0 }
  ];

  const COLORS = ['#10b981', '#f59e0b', '#f97316', '#ef4444'];

  return (
    <div className="space-y-6">
      <div className="bg-navy-900 border border-slate-800 p-5 rounded-2xl shadow-md">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl font-bold text-slate-100 font-mono tracking-tight">
            FLEET & ROAD SAFETY ANALYTICS
          </h1>
        </div>
        <p className="text-xs text-slate-400 font-mono mt-1">
          Historical risk analysis, incident severity distribution, emergency response times, and prevented collision metrics generated from SQLite database.
        </p>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 font-mono">
        <div className="bg-navy-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="text-[11px] text-slate-400">TOTAL SCENARIOS ANALYZED</div>
          <div className="text-2xl font-bold text-slate-100">53</div>
          <div className="text-[10px] text-cyan-400">Real-time telemetry queries</div>
        </div>

        <div className="bg-navy-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="text-[11px] text-slate-400">HIGH/CRITICAL RISK ALERTS</div>
          <div className="text-2xl font-bold text-amber-400">21</div>
          <div className="text-[10px] text-amber-400">Dual driver HUD broadcasts</div>
        </div>

        <div className="bg-navy-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="text-[11px] text-slate-400">PREVENTED COLLISIONS EST.</div>
          <div className="text-2xl font-bold text-emerald-400">44</div>
          <div className="text-[10px] text-emerald-400">Early warning evasive actions</div>
        </div>

        <div className="bg-navy-900 border border-slate-800 p-4 rounded-xl space-y-1">
          <div className="text-[11px] text-slate-400">AVG EMERGENCY DISPATCH</div>
          <div className="text-2xl font-bold text-cyan-300">4.2 min</div>
          <div className="text-[10px] text-cyan-400">16% faster than 5.0m target</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. SEVERITY BREAKDOWN BAR CHART */}
        <div className="bg-navy-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-slate-100 text-xs font-mono uppercase tracking-wider border-b border-slate-800 pb-2">
            INCIDENT SEVERITY BREAKDOWN
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#94a3b8" fontSize={11} fontFamily="monospace" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. RESPONSE TIME TREND LINE CHART */}
        <div className="bg-navy-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-slate-100 text-xs font-mono uppercase tracking-wider border-b border-slate-800 pb-2">
            RESPONSE TIME IMPROVEMENT TREND (MINUTES)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={responseTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} fontFamily="monospace" />
                <YAxis stroke="#94a3b8" fontSize={11} fontFamily="monospace" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="avgMinutes" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="target" stroke="#ef4444" strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
