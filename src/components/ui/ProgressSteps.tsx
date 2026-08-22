import { useEffect, useState, type ReactNode } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface Step {
  label: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number; // 0-indexed; -1 = not started, steps.length = all done
  className?: string;
}

export function ProgressSteps({ steps, currentStep, className = '' }: ProgressStepsProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      {steps.map((step, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <div key={i} className="flex items-center gap-3 py-2">
            <div className="shrink-0">
              {done ? (
                <CheckCircle2 className="w-5 h-5 text-success-500" />
              ) : active ? (
                <div className="w-5 h-5 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-surface-border-strong" />
              )}
            </div>
            <span
              className={`text-sm ${
                done
                  ? 'text-ink-muted line-through decoration-surface-border-strong'
                  : active
                  ? 'text-ink font-medium'
                  : 'text-ink-subtle'
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Hook helper: animate through steps over time
export function useAnimatedSteps(stepLabels: string[], stepDurationMs = 900) {
  const [currentStep, setCurrentStep] = useState(-1);

  useEffect(() => {
    setCurrentStep(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    stepLabels.forEach((_, i) => {
      timers.push(
        setTimeout(() => {
          setCurrentStep(i + 1);
        }, (i + 1) * stepDurationMs)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [stepLabels, stepDurationMs]);

  return { currentStep, isDone: currentStep >= stepLabels.length };
}
