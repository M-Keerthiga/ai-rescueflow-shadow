import React from 'react';
import { Users, Phone, Mail, CheckCircle2, ShieldAlert } from 'lucide-react';
import ServiceStatusBadge from './ServiceStatusBadge.jsx';

/**
 * FamilyContactsCard Component
 * Displays registered emergency family contacts, relationships, contact methods, and simulated dispatch status.
 * 
 * Props:
 * - familyContacts: Array of contact objects [{ id, name, relationship, phone, email, priority, status }]
 * - loading: boolean
 */
export default function FamilyContactsCard({ familyContacts = [], loading = false }) {
  if (loading) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 animate-pulse">
        <div className="h-4 bg-slate-800 rounded w-1/3 mb-4" />
        <div className="space-y-2">
          <div className="h-8 bg-slate-800 rounded" />
          <div className="h-8 bg-slate-800 rounded" />
        </div>
      </div>
    );
  }

  const contacts = familyContacts.length > 0 ? familyContacts : [
    {
      id: 'FAM-001',
      name: 'Sarah Jenkins',
      relationship: 'Spouse',
      phone: '+1-555-019-3321',
      email: 'sarah.jenkins@familycontact.demo',
      priority: 1,
      status: 'SIMULATED_SENT'
    },
    {
      id: 'FAM-002',
      name: 'David Jenkins Sr.',
      relationship: 'Parent',
      phone: '+1-555-019-3322',
      email: 'david.jenkins@familycontact.demo',
      priority: 2,
      status: 'SIMULATED_SENT'
    },
    {
      id: 'FAM-003',
      name: 'Emily Jenkins',
      relationship: 'Sibling',
      phone: '+1-555-019-3323',
      email: 'emily.jenkins@familycontact.demo',
      priority: 3,
      status: 'SIMULATED_SENT'
    }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:border-slate-700 transition-colors">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
            Family Emergency Contacts
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
          {contacts.length} NOTIFIED
        </span>
      </div>

      <div className="space-y-2.5 pt-3 font-mono text-xs">
        {contacts.map((contact, idx) => {
          const isPrimary = contact.priority === 1 || idx === 0;
          const statusVal = contact.status || 'SIMULATED_SENT';

          return (
            <div
              key={contact.id || idx}
              className="bg-slate-950/60 border border-slate-800/80 rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-2 hover:border-slate-700/80 transition-colors"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isPrimary
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  #{contact.priority || idx + 1}
                </div>

                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-100 font-bold truncate">{contact.name}</span>
                    <span className="text-[10px] text-cyan-400 px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/20">
                      {contact.relationship || 'Emergency Contact'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-500" />
                      {contact.phone || '+1-555-019-3321'}
                    </span>
                    <span className="hidden sm:flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-500" />
                      {contact.email || 'contact@family.demo'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ServiceStatusBadge
                  status={statusVal}
                  label={statusVal === 'SIMULATED_SENT' ? 'NOTIFIED' : statusVal}
                  size="sm"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
