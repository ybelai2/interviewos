import { useEffect, useState } from 'react';
import { ShieldCheck, FileText, Cpu, FolderGit2, ArrowRight, AlertTriangle } from 'lucide-react';
import { Link } from '@/router';
import { AppLayout } from '@/components/layout/AppLayout';
import { TopBar } from '@/components/layout/Sidebar';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar, MasteryBar } from '@/components/ui/ProgressBar';
import { Skeleton } from '@/components/ui/Feedback';
import { resumeService } from '@/services';
import type { ResumeClaim, Project } from '@/types';

const riskTone = { low: 'success', medium: 'warning', high: 'error' } as const;
const riskLabel = { low: 'LOW', medium: 'MEDIUM', high: 'HIGH' } as const;

export function ResumePage() {
  const [profile, setProfile] = useState<{ label: string; value: number }[] | null>(null);
  const [techs, setTechs] = useState<string[] | null>(null);
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [claims, setClaims] = useState<ResumeClaim[] | null>(null);

  useEffect(() => {
    resumeService.getProfile().then(setProfile);
    resumeService.getTechnologies().then(setTechs);
    resumeService.getProjects().then(setProjects);
    resumeService.getClaims().then(setClaims);
  }, []);

  return (
    <AppLayout>
      <TopBar title="Your Resume Profile" />

      {/* Profile areas */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Experience Breakdown</CardTitle>
        </CardHeader>
        <CardBody>
          {!profile ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i}>
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-2 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {profile.map((area) => (
                <div key={area.label}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-ink font-medium">{area.label}</span>
                    <span className="text-ink-subtle font-mono text-xs">{area.value}%</span>
                  </div>
                  <MasteryBar value={area.value} size="md" />
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Technologies */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-brand-600" />
            <CardTitle>Technologies Found</CardTitle>
          </div>
        </CardHeader>
        <CardBody>
          {!techs ? (
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <Skeleton key={i} className="h-7 w-20" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {techs.map((t) => (
                <Badge key={t} tone="neutral" className="text-[13px] py-1 px-2.5">{t}</Badge>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Projects */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-brand-600" />
            <CardTitle>Projects Found</CardTitle>
          </div>
        </CardHeader>
        <CardBody>
          {!projects ? (
            <div className="space-y-3">
              {[1, 2].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((p) => (
                <div key={p.id} className="border border-surface-border rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-ink">{p.name}</h4>
                      <p className="text-sm text-ink-muted mt-1">{p.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {p.technologies.map((t) => (
                          <Badge key={t} tone="brand" className="text-[11px]">{t}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <ul className="mt-3 space-y-1">
                    {p.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-ink-muted">
                        <span className="text-brand-500 mt-0.5">▸</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Resume Claims */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <CardTitle>Resume Claims</CardTitle>
          </div>
        </CardHeader>
        <CardBody>
          {!claims ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-28 w-full" />)}
            </div>
          ) : (
            <div className="space-y-3">
              {claims.map((claim) => (
                <div key={claim.id} className="border border-surface-border rounded-lg p-4 card-hover">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <p className="text-sm text-ink font-medium leading-relaxed flex-1">
                      "{claim.text}"
                    </p>
                    <Badge tone={riskTone[claim.risk]} className="shrink-0">
                      {claim.risk === 'high' && <AlertTriangle className="w-3 h-3" />}
                      {riskLabel[claim.risk]}
                    </Badge>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-ink-subtle">Category: </span>
                      <span className="text-ink-muted">{claim.category}</span>
                    </div>
                    <div>
                      <span className="text-ink-subtle">Status: </span>
                      <span className="text-ink-muted capitalize">{claim.status.replace('-', ' ')}</span>
                    </div>
                  </div>
                  <div className="mt-3 p-3 rounded-lg bg-surface-subtle">
                    <p className="text-xs text-ink-muted">
                      <span className="font-medium text-ink">Why: </span>
                      {claim.reason}
                    </p>
                  </div>
                  <div className="mt-3">
                    <Link to="/app/defense">
                      <Button variant="outline" size="sm">
                        Practice Defense <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </AppLayout>
  );
}
