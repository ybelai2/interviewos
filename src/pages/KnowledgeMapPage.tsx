import { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, MessageSquare, Target } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TopBar } from '@/components/layout/Sidebar';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MasteryBar } from '@/components/ui/ProgressBar';
import { Skeleton } from '@/components/ui/Feedback';
import { Modal } from '@/components/ui/Modal';
import { skillService, questionService, resourceService } from '@/services';
import { Link } from '@/router';
import type { Skill, Question, LearningResource } from '@/types';

const categoryColor: Record<string, string> = {
  language: 'bg-brand-500',
  framework: 'bg-success-500',
  cloud: 'bg-accent-500',
  database: 'bg-warning-500',
  devops: 'bg-brand-400',
  frontend: 'bg-brand-300',
  concept: 'bg-ink-subtle',
  tooling: 'bg-success-400',
  ai: 'bg-accent-400',
};

function SkillNode({
  skill,
  level,
  onSelect,
  selected,
}: {
  skill: Skill;
  level: number;
  onSelect: (s: Skill) => void;
  selected: string | null;
}) {
  const [children, setChildren] = useState<Skill[]>([]);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    skillService.getChildren(skill.id).then(setChildren);
  }, [skill.id]);

  const isSelected = selected === skill.id;

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => {
          onSelect(skill);
          setExpanded(!expanded);
        }}
        className={`group flex flex-col items-center gap-1.5 transition-all ${isSelected ? 'scale-105' : 'hover:scale-105'}`}
      >
        <div
          className={`relative flex items-center justify-center rounded-xl border-2 px-4 py-2.5 transition-all ${
            isSelected
              ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/40 shadow-glow'
              : 'border-surface-border bg-surface-card hover:border-brand-400'
          }`}
          style={{ marginLeft: level > 0 ? `${level * 8}px` : 0 }}
        >
          <span className={`w-2 h-2 rounded-full ${categoryColor[skill.category] || 'bg-ink-subtle'} mr-2`} />
          <span className="text-sm font-medium text-ink whitespace-nowrap">{skill.name}</span>
          <span className="text-[10px] text-ink-subtle font-mono ml-2">{skill.mastery}%</span>
        </div>
      </button>
      {expanded && children.length > 0 && (
        <div className="mt-3 space-y-3 relative">
          <div className="absolute left-1/2 -top-3 w-px h-3 bg-surface-border-strong" />
          <div className="flex flex-col items-center gap-3">
            {children.map((child) => (
              <SkillNode key={child.id} skill={child} level={level + 1} onSelect={onSelect} selected={selected} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function KnowledgeMapPage() {
  const [roots, setRoots] = useState<Skill[]>([]);
  const [selected, setSelected] = useState<Skill | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [resources, setResources] = useState<LearningResource[]>([]);

  useEffect(() => {
    skillService.getRoots().then(setRoots);
  }, []);

  const handleSelect = (skill: Skill) => {
    setSelected(skill);
    questionService.getQuestionsForSkill(skill.id).then(setQuestions);
    resourceService.getResourcesForSkill(skill.id).then(setResources);
  };

  return (
    <AppLayout>
      <TopBar title="Knowledge Map" />

      <p className="text-sm text-ink-muted mb-6">
        Click a node to expand its related concepts. Select any skill to view details, weak areas, and practice questions.
      </p>

      <Card className="mb-6 overflow-x-auto">
        <CardBody>
          {roots.length === 0 ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-32" />
              <div className="flex gap-4">
                {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-28" />)}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-6 py-4">
              {roots.map((root) => (
                <SkillNode key={root.id} skill={root} level={0} onSelect={handleSelect} selected={selected?.id ?? null} />
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Skill detail */}
      {selected && (
        <Card className="animate-fade-up">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{selected.name}</CardTitle>
              <Badge tone="brand">{selected.mastery}% mastery</Badge>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle mb-2">Mastery</p>
                  <MasteryBar value={selected.mastery} size="md" />
                </div>
                {selected.resumeExcerpt && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle mb-2">Your Resume</p>
                    <p className="text-sm text-ink-muted italic">"{selected.resumeExcerpt}"</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle mb-2">Concepts</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.relatedConcepts.map((c) => (
                      <Badge key={c} tone="neutral">{c}</Badge>
                    ))}
                  </div>
                </div>
                {selected.weakAreas.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle mb-2">Weak Areas</p>
                    <ul className="space-y-1">
                      {selected.weakAreas.map((w) => (
                        <li key={w} className="flex items-center gap-2 text-sm text-ink-muted">
                          <Target className="w-3.5 h-3.5 text-warning-500 shrink-0" />
                          {w}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle mb-2">Interview Questions</p>
                  {questions.length === 0 ? (
                    <p className="text-sm text-ink-subtle">No questions generated yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {questions.slice(0, 3).map((q) => (
                        <div key={q.id} className="p-3 rounded-lg border border-surface-border bg-surface-subtle">
                          <p className="text-sm text-ink">{q.prompt}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge tone="neutral" className="capitalize">{q.difficulty}</Badge>
                            <Badge tone="brand" className="capitalize">{q.category.replace('-', ' ')}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <Link to="/app/interview">
                    <Button variant="outline" size="sm" className="mt-3">
                      <MessageSquare className="w-3.5 h-3.5" /> Practice
                    </Button>
                  </Link>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle mb-2">Learning Resources</p>
                  {resources.length === 0 ? (
                    <p className="text-sm text-ink-subtle">No resources available.</p>
                  ) : (
                    <div className="space-y-2">
                      {resources.slice(0, 2).map((r) => (
                        <div key={r.id} className="flex items-center justify-between p-3 rounded-lg border border-surface-border">
                          <div>
                            <p className="text-sm font-medium text-ink">{r.title}</p>
                            <p className="text-xs text-ink-subtle">{r.source} · {r.duration}</p>
                          </div>
                          <BookOpen className="w-4 h-4 text-ink-subtle" />
                        </div>
                      ))}
                    </div>
                  )}
                  <Link to="/app/learning">
                    <Button variant="ghost" size="sm" className="mt-3">
                      View Resources <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {!selected && (
        <Card className="p-10 text-center">
          <p className="text-sm text-ink-subtle">Select a skill node above to see details.</p>
        </Card>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.name} size="lg">
        {selected && (
          <div className="space-y-5">
            <MasteryBar value={selected.mastery} size="lg" showLabel />
          </div>
        )}
      </Modal>
    </AppLayout>
  );
}
