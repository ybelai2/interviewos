import { type ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

type Tone = 'success' | 'warning' | 'error' | 'info';

interface CalloutProps {
  tone?: Tone;
  title?: string;
  children: ReactNode;
  className?: string;
}

const config: Record<Tone, { icon: typeof CheckCircle2; classes: string }> = {
  success: {
    icon: CheckCircle2,
    classes: 'border-success-200 bg-success-50 dark:border-success-800/60 dark:bg-success-950/30',
  },
  warning: {
    icon: AlertTriangle,
    classes: 'border-warning-200 bg-warning-50 dark:border-warning-800/60 dark:bg-warning-950/30',
  },
  error: {
    icon: XCircle,
    classes: 'border-error-200 bg-error-50 dark:border-error-800/60 dark:bg-error-950/30',
  },
  info: {
    icon: Info,
    classes: 'border-brand-200 bg-brand-50 dark:border-brand-800/60 dark:bg-brand-950/30',
  },
};

const iconColor: Record<Tone, string> = {
  success: 'text-success-600',
  warning: 'text-warning-600',
  error: 'text-error-600',
  info: 'text-brand-600',
};

export function Callout({ tone = 'info', title, children, className = '' }: CalloutProps) {
  const { icon: Icon, classes } = config[tone];
  return (
    <div className={`flex gap-3 rounded-lg border p-4 ${classes} ${className}`}>
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor[tone]}`} />
      <div className="flex-1">
        {title && <p className="text-sm font-semibold text-ink mb-0.5">{title}</p>}
        <div className="text-sm text-ink-muted">{children}</div>
      </div>
    </div>
  );
}
