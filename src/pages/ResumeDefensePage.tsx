import { useEffect, useState } from 'react';
import { ShieldCheck, ArrowRight, AlertTriangle, CheckCircle2, Circle, Play } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TopBar } from '@/components/layout/Sidebar';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MasteryBar, ProgressBar } from '@/components/ui/ProgressBar';
import { Skeleton } from '@/components/ui/Feedback';
import { resumeService } from '@/services';
import type { ResumeClaim, ClaimStatus } from '@/types';

const statusConfig: Record<ClaimStatus, { tone: 'success' | 'warning' | 'error' | 'neutral'; label: string }> = {
  mastered: { tone: 'success', label: 'MASTERED' },
  developing: { tone: 'brand', label: 'DEVELOPING' },
  weak: { tone: 'warning', label: 'WEAK' },
  'needs-practice': { tone: 'error', label: 'NEEDS PRACTICE' },
};

const riskTone = { low: 'success', medium: 'warning', high: 'error' } as const;

export function ResumeDefensePage() {
  const [claims, setClaims] = useState<ResumeClaim[]>([]);
  const [activeClaim, setActiveClaim] = useState<ResumeClaim | null>(null);

  useEffect(() => {
    resumeService.getClaims().then((c) => {
      setClaims(c);
      setActiveClaim(c[0] ?? null);
    });
  }, []);

  const mastered = claims.filter((c) => c.status === 'mastered').length;
  const developing = claims.filter((c) => c.status === 'developing').length;
  const weak = claims.filter((c) => c.status === 'weak' || c.status === 'needs-practice').length;

  return (
    <AppLayout>
      <TopBar title="Resume Defense" />

      {/* Hero stat */}
      <Card className="mb-6 bg-gradient-to-br from-brand-50 to-surface-card dark:from-brand-950/30 dark:to-surface-card">
        <CardBody>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-brand-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-ink">Can you defend your resume?</h2>
              <p className="text-sm text-ink-muted">Every claim is a question waiting to be asked.</p>
            </div>
          </div>

          {claims.length === 0 ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            <>
              <p className="text-sm text-ink-muted mb-3">
                <span className="text-2xl font-bold text-ink">{claims.length}</span> technical claims detected.
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-surface-card border border-surface-border">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-success-500" />
                    <span className="text-xs text-ink-subtle">Mastered</span>
                  </div>
                  <p className="text-xl font-bold text-ink mt-1">{mastered}</p>
                </div>
                <div className="p-3 rounded-lg bg-surface-card border border-surface-border">
                  <div className="flex items-center gap-2">
                    <Circle className="w-4 h-4 text-brand-500" />
                    <span className="text-xs text-ink-subtle">Developing</span>
                  </div>
                  <p className="text-xl font-bold text-ink mt-1">{developing}</p>
                </div>
                <div className="p-3 rounded-lg bg-surface-card border border-surface-border">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning-500" />
                    <span className="text-xs text-ink-subtle">Weak</span>
                  </div>
                  <p className="text-xl font-bold text-ink mt-1">{weak}</p>
                </div>
              </div>
            </>
          )}
        </CardBody>
      </Card>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Claims list */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle mb-3">Claims</p>
          <div className="space-y-2">
            {claims.length === 0 ? (
              [1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)
            ) : (
              claims.map((claim) => {
                const isActive = activeClaim?.id === claim.id;
                const sc = statusConfig[claim.status];
                return (
                  <button
                    key={claim.id}
                    onClick={() => setActiveClaim(claim)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isActive
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30'
                        : 'border-surface-border hover:border-surface-border-strong bg-surface-card'
                    }`}
                  >
                    <p className={`text-sm leading-snug line-clamp-2 ${isActive ? 'text-ink' : 'text-ink-muted'}`}>
                      "{claim.text}"
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Badge tone={sc.tone} className="text-[10px]">{sc.label}</Badge>
                      <Badge tone={riskTone[claim.risk]} className="text-[10px]">{claim.risk.toUpperCase()}</Badge>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Active claim detail */}
        <div>
          {activeClaim && (
            <Card className="animate-fade-up">
              <CardHeader>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge tone={statusConfig[activeClaim.status].tone}>
                    {statusConfig[activeClaim.status].label}
                  </Badge>
                  <Badge tone={riskTone[activeClaim.risk]}>
                    {activeClaim.risk === 'high' && <AlertTriangle className="w-3 h-3" />}
                    {activeClaim.risk.toUpperCase()} RISK
                  </Badge>
                  <Badge tone="neutral">{activeClaim.category}</Badge>
                </div>
              </CardHeader>
              <CardBody>
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle mb-2">Claim</p>
                  <p className="text-base text-ink font-medium leading-relaxed">"{activeClaim.text}"</p>
                </div>

                <div className="p-3 rounded-lg bg-surface-subtle mb-5">
                  <p className="text-xs font-medium text-ink mb-0.5">Why this matters</p>
                  <p className="text-sm text-ink-muted">{activeClaim.reason}</p>
                </div>

                {/* Potential questions */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle mb-3">
                    Potential interviewer questions
                  </p>
                  <ol className="space-y-2">
                    {activeClaim.potentialQuestions.map((q, i) => (
                      <li key={i} className="flex items-start gap-3 p-3 rounded-lg border border-surface-border">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-surface-subtle text-xs font-mono text-ink-muted shrink-0">
                          {i + 1}
                        </span>
                        <p className="text-sm text-ink">{q}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="mt-6 flex items-center gap-2">
                  <Button>
                    <Play className="w-4 h-4" /> Start Defense
                  </Button>
                  <Button variant="outline">
                    Practice Questions <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
