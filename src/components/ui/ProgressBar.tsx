interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

export function ProgressBar({
  value,
  max = 100,
  className = '',
  barClassName = '',
  showLabel = false,
  size = 'md',
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full ${sizeClasses[size]} bg-surface-subtle rounded-full overflow-hidden`}>
        <div
          className={`h-full rounded-full bg-brand-500 transition-all duration-500 ease-out ${barClassName}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-xs text-ink-subtle font-mono">
          {Math.round(pct)}%
        </div>
      )}
    </div>
  );
}

// Colored variant based on value thresholds
export function MasteryBar({ value, size = 'md', className = '' }: { value: number; size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const tone =
    value >= 75 ? 'bg-success-500' : value >= 50 ? 'bg-brand-500' : value >= 30 ? 'bg-warning-500' : 'bg-error-500';
  return <ProgressBar value={value} size={size} barClassName={tone} className={className} />;
}
