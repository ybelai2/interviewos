import { type HTMLAttributes } from 'react';

type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'error' | 'accent';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

const tones: Record<Tone, string> = {
  neutral: 'bg-surface-subtle text-ink-muted border-surface-border',
  brand: 'bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-950/50 dark:text-brand-300 dark:border-brand-800',
  success: 'bg-success-50 text-success-700 border-success-200 dark:bg-success-950/40 dark:text-success-300 dark:border-success-800',
  warning: 'bg-warning-50 text-warning-700 border-warning-200 dark:bg-warning-950/40 dark:text-warning-300 dark:border-warning-800',
  error: 'bg-error-50 text-error-700 border-error-200 dark:bg-error-950/40 dark:text-error-300 dark:border-error-800',
  accent: 'bg-accent-50 text-accent-700 border-accent-200 dark:bg-accent-950/40 dark:text-accent-300 dark:border-accent-800',
};

export function Badge({ tone = 'neutral', className = '', children, ...props }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md border ${tones[tone]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
