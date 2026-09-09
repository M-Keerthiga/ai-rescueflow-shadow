import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline';
}

export function Button({ className, variant = 'default', ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50',
        variant === 'outline' ? 'border border-slate-700 bg-slate-900 text-slate-200' : 'bg-red-600 text-white hover:bg-red-700',
        className,
      )}
      {...props}
    />
  );
}
