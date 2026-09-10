import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Eye,
  Sliders,
  AlertOctagon,
  BarChart3,
  Settings,
  ChevronRight,
  Camera,
  Shield
} from 'lucide-react';

export default function Sidebar() {
  const navSections = [
    {
      title: 'OPERATIONAL COMMAND',
      items: [
        { path: '/', label: 'Command Center', icon: LayoutDashboard },
      ]
    },
    {
      title: 'AI SHADOW (PRE-ACCIDENT)',
      items: [
        { path: '/shadow/prediction', label: 'Live Camera / Video', icon: Camera },
        { path: '/shadow/what-if', label: 'What-If Simulator', icon: Sliders }
      ]
    },
    {
      title: 'AI RESCUEFLOW (POST-ACCIDENT)',
      items: [
        { path: '/rescue/analysis', label: 'Incident Analysis', icon: AlertOctagon },
        { path: '/rescue/history', label: 'Reported Incidents History', icon: AlertOctagon },
        { path: '/police', label: 'Police Dashboard', icon: Shield },
        { path: '/analytics', label: 'Analytics & Heatmaps', icon: BarChart3 }
      ]
    },
    { title: 'SETTINGS', items: [{ path: '/settings', label: 'Settings', icon: Settings }] }
  ];

  return (
    <aside className="w-64 bg-navy-900 border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-6rem)]">
      <div className="p-4 space-y-6">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-2">
            <h2 className="text-[10px] font-bold tracking-wider text-slate-500 uppercase px-3 font-mono">
              {section.title}
            </h2>
            <nav className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-sm font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-cyan-400/80" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-600" />
                  </NavLink>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="mt-auto p-4 border-t border-slate-800/60 bg-navy-950/40">
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center justify-between font-mono text-slate-300">
            <span>HARNESS STATUS</span>
            <span className="text-emerald-400 flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              OPERATIONAL
            </span>
          </div>
          <p className="text-[10px] text-slate-500">
            AI RescueFlow services and incident monitoring.
          </p>
        </div>
      </div>
    </aside>
  );
}
