import { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Clock, Layers, FileText, BookOpen, TrendingUp } from 'lucide-react';
import { Link } from '@/router';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MasteryBar } from '@/components/ui/ProgressBar';
import { skillService } from '@/services';
import { readinessScore, claimsMasteredCount, claimsTotalCount } from '@/data/seed';
import type { Skill } from '@/types';

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

export function DashboardPage() {
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    skillService.getSkills().then(setSkills);
  }, []);

  const gaps = skills
    .filter((s) => s.mastery < s.targetMastery)
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, 4);

  return (
    <AppLayout>
      <TopBar />

      {/* Greeting + Readiness */}
      <div className="mb-6">
        <p className="text-ink-muted">{greeting()}.</p>
        <div className="flex items-baseline gap-3 mt-1">
          <h2 className="text-2xl font-semibold tracking-tight text-ink">
            Your interview readiness is:
          </h2>
          <span className="text-3xl font-bold text-brand-600">{readinessScore}<span className="text-lg text-ink-subtle">/100</span></span>
        </div>
        <p className="text-sm text-success-600 mt-1 flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" /> +4 this week
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-6">
        {/* Today's Training */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <CardTitle>Today's Training</CardTitle>
              </div>
              <Badge tone="brand"><Clock className="w-3 h-3" /> 15 min</Badge>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { icon: Layers, label: '3 Flashcards' },
                { icon: FileText, label: '2 Technical Questions' },
                { icon: ShieldCheck, label: '1 Resume Claim' },
                { icon: BookOpen, label: '1 Learning Resource' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 p-3 rounded-lg bg-surface-subtle">
                  <item.icon className="w-4 h-4 text-brand-600 shrink-0" />
                  <span className="text-sm text-ink-muted">{item.label}</span>
                </div>
              ))}
            </div>
            <Link to="/app/flashcards">
              <Button className="w-full">Start Training <ArrowRight className="w-4 h-4" /></Button>
            </Link>
          </CardBody>
        </Card>

        {/* Resume Defense */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              <CardTitle>Resume Defense</CardTitle>
            </div>
          </CardHeader>
          <CardBody>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" strokeWidth="6" className="stroke-surface-subtle" />
                  <circle
                    cx="40" cy="40" r="34" fill="none" strokeWidth="6"
                    strokeLinecap="round"
                    className="stroke-brand-500 transition-all duration-1000"
                    strokeDasharray={`${2 * Math.PI * 34}`}
                    strokeDashoffset={`${2 * Math.PI * 34 * (1 - claimsMasteredCount / claimsTotalCount)}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-ink">{claimsMasteredCount}</span>
                  <span className="text-[10px] text-ink-subtle">/ {claimsTotalCount}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-ink font-medium">Claims mastered</p>
                <p className="text-xs text-ink-muted mt-1">
                  {claimsTotalCount - claimsMasteredCount} claims still need practice.
                </p>
              </div>
            </div>
            <Link to="/app/defense">
              <Button variant="outline" className="w-full">Practice Claims <ArrowRight className="w-4 h-4" /></Button>
            </Link>
          </CardBody>
        </Card>
      </div>

      {/* Top Knowledge Gaps */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Top Knowledge Gaps</CardTitle>
        </CardHeader>
        <CardBody>
          {gaps.length === 0 ? (
            <p className="text-sm text-ink-muted">No gaps detected. You're on track!</p>
          ) : (
            <div className="space-y-4">
              {gaps.map((gap) => (
                <div key={gap.id}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-ink font-medium">{gap.name}</span>
                    <span className="text-ink-subtle font-mono text-xs">{gap.mastery}%</span>
                  </div>
                  <MasteryBar value={gap.mastery} size="sm" />
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Continue Learning */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-600" />
            <CardTitle>Continue Learning</CardTitle>
          </div>
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink">AWS SQS</p>
              <p className="text-xs text-ink-muted mt-1">
                Message delivery, retries, visibility timeout, and dead-letter queues
              </p>
              <p className="text-xs text-ink-subtle mt-2 flex items-center gap-1">
                <Clock className="w-3 h-3" /> 12 min
              </p>
            </div>
            <Link to="/app/learning">
              <Button variant="outline" size="sm">Continue <ArrowRight className="w-3.5 h-3.5" /></Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    </AppLayout>
  );
}
