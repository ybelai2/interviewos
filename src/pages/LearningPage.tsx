import { useEffect, useState } from 'react';
import { ArrowRight, Clock, Target, BookOpen, ExternalLink, FileText, Video, FileCode } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TopBar } from '@/components/layout/Sidebar';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MasteryBar, ProgressBar } from '@/components/ui/ProgressBar';
import { Skeleton } from '@/components/ui/Feedback';
import { learningService, resourceService, skillService } from '@/services';
import type { LearningTopic, LearningResource, Skill, Difficulty } from '@/types';

const typeIcon = {
  documentation: FileText,
  video: Video,
  article: FileCode,
  tutorial: BookOpen,
  course: BookOpen,
  book: BookOpen,
};

const diffTone: Record<Difficulty, 'success' | 'brand' | 'warning' | 'error'> = {
  beginner: 'success',
  intermediate: 'brand',
  advanced: 'warning',
  expert: 'error',
};

export function LearningPage() {
  const [topics, setTopics] = useState<LearningTopic[]>([]);
  const [resources, setResources] = useState<LearningResource[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [activeSkillId, setActiveSkillId] = useState<string | null>(null);

  useEffect(() => {
    learningService.getTopics().then(setTopics);
    resourceService.getResources().then(setResources);
    skillService.getSkills().then(setSkills);
  }, []);

  const skillMap = new Map(skills.map((s) => [s.id, s]));
  const activeResources = resources.filter((r) => r.skillId === activeSkillId);

  return (
    <AppLayout>
      <TopBar title="Your Personalized Curriculum" />

      <p className="text-sm text-ink-muted mb-6">
        Every topic is recommended based on your resume claims and assessment results. Learn what you need next — not what you already know.
      </p>

      {/* Priority topics */}
      <div className="space-y-4 mb-8">
        {topics.length === 0 ? (
          [1, 2].map((i) => <Skeleton key={i} className="h-32 w-full" />)
        ) : (
          topics.map((topic) => {
            const skill = skillMap.get(topic.skillId);
            if (!skill) return null;
            const isActive = activeSkillId === topic.skillId;
            return (
              <Card key={topic.id} hover className={`p-5 ${isActive ? 'border-brand-500 shadow-glow' : ''}`}>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-brand-600 text-white text-xs font-bold">
                        {topic.priority}
                      </span>
                      <h3 className="text-base font-semibold text-ink">{skill.name}</h3>
                      <Badge tone="neutral" className="text-[11px]">{topic.estimatedTime}</Badge>
                    </div>

                    <div className="flex items-center gap-3 mb-3 max-w-xs">
                      <span className="text-xs font-mono text-ink-subtle w-10 text-right">{topic.currentMastery}%</span>
                      <div className="flex-1">
                        <ProgressBar value={topic.currentMastery} barClassName="bg-warning-500" size="sm" />
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-ink-subtle" />
                      <span className="text-xs font-mono text-brand-600 w-10">{topic.targetMastery}%</span>
                    </div>

                    <div className="p-3 rounded-lg bg-surface-subtle">
                      <p className="text-xs font-medium text-ink mb-0.5">Why you're seeing this</p>
                      <p className="text-sm text-ink-muted">{topic.reason}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 shrink-0">
                    <Button size="sm" onClick={() => setActiveSkillId(isActive ? null : topic.skillId)}>
                      <BookOpen className="w-3.5 h-3.5" /> Start Learning
                    </Button>
                    {isActive && activeResources.length > 0 && (
                      <Button variant="ghost" size="sm" onClick={() => setActiveSkillId(null)}>
                        Hide resources
                      </Button>
                    )}
                  </div>
                </div>

                {/* Inline resources */}
                {isActive && activeResources.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-surface-border space-y-2 animate-fade-up">
                    {activeResources.map((r) => {
                      const Icon = typeIcon[r.type] || BookOpen;
                      return (
                        <a
                          key={r.id}
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-start gap-3 p-3 rounded-lg border border-surface-border hover:border-brand-400 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-surface-subtle flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-brand-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-ink group-hover:text-brand-600 transition-colors">{r.title}</p>
                            <p className="text-xs text-ink-subtle mt-0.5">{r.source} · {r.duration}</p>
                            <p className="text-xs text-ink-muted mt-1">{r.description}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge tone={diffTone[r.difficulty]} className="capitalize">{r.difficulty}</Badge>
                            <ExternalLink className="w-3.5 h-3.5 text-ink-subtle group-hover:text-brand-600 transition-colors" />
                          </div>
                        </a>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })
        )}
      </div>

      {/* All resources section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-600" />
            <CardTitle>All Learning Resources</CardTitle>
          </div>
        </CardHeader>
        <CardBody>
          {resources.length === 0 ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {resources.map((r) => {
                const skill = skillMap.get(r.skillId);
                const Icon = typeIcon[r.type] || BookOpen;
                return (
                  <a
                    key={r.id}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 rounded-lg border border-surface-border hover:border-brand-400 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-surface-subtle flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-brand-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink group-hover:text-brand-600 transition-colors truncate">{r.title}</p>
                      <p className="text-xs text-ink-subtle mt-0.5">{skill?.name} · {r.source}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge tone={diffTone[r.difficulty]} className="text-[10px] capitalize">{r.difficulty}</Badge>
                        <span className="text-[11px] text-ink-subtle flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {r.duration}
                        </span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>
    </AppLayout>
  );
}
