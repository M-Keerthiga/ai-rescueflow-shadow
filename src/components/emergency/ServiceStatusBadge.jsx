import React from 'react';

/**
 * ServiceStatusBadge Component
 * Reusable high-contrast status badge for emergency coordination components.
 * 
 * Supported states:
 * - READY
 * - ACTIVE
 * - NOTIFIED
 * - DISPATCHED
 * - COMPLETED
 * - FAILED
 */
export default function ServiceStatusBadge({
  status = 'READY',
  label = null,
  size = 'sm',
  className = '',
  showDot = true
}) {
  const normStatus = String(status || 'READY').toUpperCase().trim();

  // Color mapping and visual attributes
  const configMap = {
    READY: {
      bg: 'bg-slate-800/80',
      text: 'text-slate-300',
      border: 'border-slate-700',
      dot: 'bg-slate-400',
      defaultLabel: 'READY'
    },
    ACTIVE: {
      bg: 'bg-amber-500/20',
      text: 'text-amber-300 font-semibold',
      border: 'border-amber-500/50',
      dot: 'bg-amber-400 animate-ping',
      defaultLabel: 'ACTIVE'
    },
    NOTIFIED: {
      bg: 'bg-cyan-500/20',
      text: 'text-cyan-300 font-semibold',
      border: 'border-cyan-500/50',
      dot: 'bg-cyan-400',
      defaultLabel: 'NOTIFIED'
    },
    SIMULATED_SENT: {
      bg: 'bg-cyan-500/20',
      text: 'text-cyan-300 font-semibold',
      border: 'border-cyan-500/50',
      dot: 'bg-cyan-400',
      defaultLabel: 'SIMULATED SENT'
    },
    DISPATCHED: {
      bg: 'bg-indigo-500/20',
      text: 'text-indigo-300 font-semibold',
      border: 'border-indigo-500/50',
      dot: 'bg-indigo-400 animate-pulse',
      defaultLabel: 'DISPATCHED'
    },
    SIMULATED_DISPATCHED: {
      bg: 'bg-indigo-500/20',
      text: 'text-indigo-300 font-semibold',
      border: 'border-indigo-500/50',
      dot: 'bg-indigo-400 animate-pulse',
      defaultLabel: 'SIMULATED DISPATCHED'
    },
    COMPLETED: {
      bg: 'bg-emerald-500/20',
      text: 'text-emerald-300 font-bold',
      border: 'border-emerald-500/50',
      dot: 'bg-emerald-400',
      defaultLabel: 'COMPLETED'
    },
    FAILED: {
      bg: 'bg-red-500/25',
      text: 'text-red-300 font-bold',
      border: 'border-red-500/60',
      dot: 'bg-red-500',
      defaultLabel: 'FAILED'
    },
    SKIPPED_DUPLICATE: {
      bg: 'bg-orange-500/20',
      text: 'text-orange-300 font-semibold',
      border: 'border-orange-500/40',
      dot: 'bg-orange-400',
      defaultLabel: 'SKIPPED DUPLICATE'
    },
    RETRYING: {
      bg: 'bg-amber-500/20',
      text: 'text-amber-300 font-semibold',
      border: 'border-amber-500/50',
      dot: 'bg-amber-400 animate-pulse',
      defaultLabel: 'RETRYING'
    }
  };

  const current = configMap[normStatus] || configMap.READY;
  const displayLabel = label || current.defaultLabel;

  const sizeClasses = size === 'md'
    ? 'px-2.5 py-1 text-xs gap-1.5'
    : 'px-2 py-0.5 text-[11px] gap-1';

  return (
    <span
      role="status"
      aria-label={`Status: ${displayLabel}`}
      className={`inline-flex items-center font-mono rounded-md border tracking-wide select-none ${sizeClasses} ${current.bg} ${current.text} ${current.border} ${className}`}
    >
      {showDot && (
        <span className="relative flex h-2 w-2">
          {normStatus === 'ACTIVE' && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${current.dot}`} />
        </span>
      )}
      <span>{displayLabel}</span>
    </span>
  );
}
