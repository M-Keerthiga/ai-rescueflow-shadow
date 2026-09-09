import * as React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium',
        variant === 'outline'
          ? 'border border-slate-700 bg-slate-800 text-slate-300'
          : 'border border-slate-700 bg-slate-900 text-slate-200',
        className,
      )}
      {...props}
    />
  );
}
