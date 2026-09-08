import React from 'react';
import { Shield, Users, Hospital, ShieldAlert, Check, ArrowRight } from 'lucide-react';

export const SEVERITY_TIERS = [
  {
    level: 'LOW',
    label: 'Low Severity',
    priority: 'Standard Priority',
    color: 'emerald',
    badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    recipients: { family: true, hospital: false, police: false },
    channels: 12,
    description: 'Minor bumper/fender impact — Notifies registered family contacts only.'
  },
  {
    level: 'MODERATE',
    label: 'Moderate Severity',
    priority: 'High Priority',
    color: 'blue',
    badgeClass: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    recipients: { family: true, hospital: true, police: false },
    channels: 16,
    description: 'Moderate structural collision — Pre-alerts nearest hospital trauma triage and family.'
  },
  {
    level: 'HIGH',
    label: 'High Severity',
    priority: 'High Priority',
    color: 'amber',
    badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    recipients: { family: true, hospital: true, police: true },
    channels: 20,
    description: 'High kinetic impact — Dispatches nearest hospital trauma unit, municipal police, and family.'
  },
  {
    level: 'CRITICAL',
    label: 'Critical Severity',
    priority: 'Highest Priority',
    color: 'orange',
    badgeClass: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
    recipients: { family: true, hospital: true, police: true },
    channels: 20,
    description: 'Severe multi-vehicle collision with passenger compartment intrusion — Highest priority code 3 response.'
  },
  {
    level: 'CATASTROPHIC',
    label: 'Catastrophic Severity',
    priority: 'Immediate Highest Priority',
    color: 'red',
    badgeClass: 'bg-red-500/20 text-red-400 border-red-500/40',
    recipients: { family: true, hospital: true, police: true },
    channels: 20,
    description: 'Mass-casualty rollovers/crush event — Immediate highest priority code 3 emergency dispatch.'
  }
];

export default function SeverityNotificationMatrix({ activeSeverity = null, onSelectSeverity = null }) {
  return (
    <div className="bg-navy-900 border border-slate-800 rounded-xl p-4 font-mono text-xs shadow-md space-y-3">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          <h3 className="font-bold text-slate-100 uppercase tracking-wider text-[11px]">
            AUTOMATIC SEVERITY & RECIPIENT DISPATCH MATRIX
          </h3>
        </div>
        <span className="text-[10px] text-slate-400">
          Deterministic Policy Routing
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[10px] text-slate-400 uppercase tracking-wider">
              <th className="py-2 px-2.5">Severity Level</th>
              <th className="py-2 px-2.5">Response Priority</th>
              <th className="py-2 px-2 text-center">
                <span className="inline-flex items-center gap-1"><Users className="w-3 h-3 text-cyan-400" /> Family</span>
              </th>
              <th className="py-2 px-2 text-center">
                <span className="inline-flex items-center gap-1"><Hospital className="w-3 h-3 text-rose-400" /> Hospital</span>
              </th>
              <th className="py-2 px-2 text-center">
                <span className="inline-flex items-center gap-1"><ShieldAlert className="w-3 h-3 text-blue-400" /> Police</span>
              </th>
              <th className="py-2 px-2.5 text-right">Total Transmissions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-[11px]">
            {SEVERITY_TIERS.map((tier) => {
              const isSelected = activeSeverity?.toUpperCase() === tier.level;

              return (
                <tr
                  key={tier.level}
                  onClick={() => onSelectSeverity && onSelectSeverity(tier.level)}
                  className={`transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/40 font-bold border-l-4 border-l-cyan-400'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  <td className="py-2.5 px-2.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${tier.badgeClass}`}>
                      {tier.level}
                    </span>
                  </td>

                  <td className="py-2.5 px-2.5 text-slate-300">
                    {tier.priority}
                  </td>

                  {/* Family Check */}
                  <td className="py-2.5 px-2 text-center">
                    {tier.recipients.family ? (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                        <Check className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>

                  {/* Hospital Check */}
                  <td className="py-2.5 px-2 text-center">
                    {tier.recipients.hospital ? (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40">
                        <Check className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>

                  {/* Police Check */}
                  <td className="py-2.5 px-2 text-center">
                    {tier.recipients.police ? (
                      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40">
                        <Check className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>

                  <td className="py-2.5 px-2.5 text-right font-mono font-bold text-slate-200">
                    {tier.channels} Dispatches
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-2 flex items-center justify-between">
        <span>* Every recipient receives simulated SMS, Phone, Email, and Push alerts (4 channels per recipient).</span>
        <span className="text-amber-400 font-bold">SIMULATION ONLY</span>
      </div>
    </div>
  );
}
