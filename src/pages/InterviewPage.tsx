import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, AlertTriangle, Sparkles, Clock } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TopBar } from '@/components/layout/Sidebar';
import { Card, CardHeader, CardTitle, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Input';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Skeleton } from '@/components/ui/Feedback';
import { questionService, assessmentService } from '@/services';
import type { Question, AnswerEvaluation, Difficulty } from '@/types';

const diffTone: Record<Difficulty, 'success' | 'brand' | 'warning' | 'error'> = {
  beginner: 'success',
  intermediate: 'brand',
  advanced: 'warning',
  expert: 'error',
};

const catLabel: Record<string, string> = {
  'resume-defense': 'Resume Defense',
  'system-design': 'System Design',
  'follow-up': 'Follow-up',
  definition: 'Definition',
  application: 'Application',
  tradeoffs: 'Trade-offs',
  troubleshooting: 'Troubleshooting',
  behavioral: 'Behavioral',
};

function ScoreBar({ label, value }: { label: string; value: number }) {
  const tone = value >= 75 ? 'bg-success-500' : value >= 50 ? 'bg-brand-500' : value >= 30 ? 'bg-warning-500' : 'bg-error-500';
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-ink-muted">{label}</span>
        <span className="text-ink-subtle font-mono">{value}%</span>
      </div>
      <ProgressBar value={value} barClassName={tone} size="sm" />
    </div>
  );
}

export function InterviewPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selected, setSelected] = useState<Question | null>(null);
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [evaluation, setEvaluation] = useState<AnswerEvaluation | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    questionService.getQuestions().then((qs) => {
      setQuestions(qs);
      setSelected(qs[0] ?? null);
    });
  }, []);

  const handleSubmit = () => {
    if (!answer.trim() || !selected) return;
    setLoading(true);
    setSubmitted(true);
    assessmentService.evaluate(answer, selected.id).then((ev) => {
      setEvaluation(ev);
      setLoading(false);
    });
  };

  const handleNext = () => {
    setSubmitted(false);
    setEvaluation(null);
    setAnswer('');
    if (!selected) return;
    const idx = questions.findIndex((q) => q.id === selected.id);
    const nextQ = questions[(idx + 1) % questions.length];
    setSelected(nextQ);
  };

  return (
    <AppLayout>
      <TopBar title="Interview Practice" />

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        {/* Question list */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle mb-3">Questions</p>
          <div className="space-y-2">
            {questions.length === 0 ? (
              [1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)
            ) : (
              questions.map((q) => {
                const isActive = selected?.id === q.id;
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setSelected(q);
                      setSubmitted(false);
                      setEvaluation(null);
                      setAnswer('');
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isActive
                        ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30'
                        : 'border-surface-border hover:border-surface-border-strong bg-surface-card'
                    }`}
                  >
                    <p className={`text-sm leading-snug line-clamp-2 ${isActive ? 'text-ink' : 'text-ink-muted'}`}>
                      {q.prompt}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Badge tone={diffTone[q.difficulty]} className="text-[10px] capitalize">{q.difficulty}</Badge>
                      <Badge tone="neutral" className="text-[10px]">{catLabel[q.category] || q.category}</Badge>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Question detail */}
        <div>
          {selected && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge tone={diffTone[selected.difficulty]} className="capitalize">{selected.difficulty}</Badge>
                  <Badge tone="brand">{catLabel[selected.category] || selected.category}</Badge>
                </div>
              </CardHeader>
              <CardBody>
                <p className="text-lg text-ink font-medium leading-relaxed mb-5">
                  {selected.prompt}
                </p>

                {/* Related skills */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {selected.relatedSkillIds.map((id) => (
                    <Badge key={id} tone="neutral" className="text-[11px]">
                      {id.replace('skill-', '').replace(/-/g, ' ')}
                    </Badge>
                  ))}
                </div>

                {!submitted ? (
                  <>
                    <Textarea
                      rows={8}
                      placeholder="Type your answer here..."
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                    />
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-xs text-ink-subtle flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Take your time — think before answering.
                      </p>
                      <Button onClick={handleSubmit} disabled={!answer.trim()}>
                        Submit Answer
                      </Button>
                    </div>
                  </>
                ) : !evaluation || loading ? (
                  <div className="flex flex-col items-center py-12 animate-fade-in">
                    <div className="w-10 h-10 rounded-full border-2 border-brand-500 border-t-transparent animate-spin mb-4" />
                    <p className="text-sm text-ink-muted">Evaluating your answer...</p>
                  </div>
                ) : (
                  <div className="space-y-5 animate-fade-up">
                    {/* Scores */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <ScoreBar label="Technical Accuracy" value={evaluation.technicalAccuracy} />
                      <ScoreBar label="Depth" value={evaluation.depth} />
                      <ScoreBar label="Specificity" value={evaluation.specificity} />
                      <ScoreBar label="Communication" value={evaluation.communication} />
                    </div>

                    {/* Did well */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-success-600 mb-2">What you did well</p>
                      <ul className="space-y-1.5">
                        {evaluation.didWell.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-ink-muted">
                            <CheckCircle2 className="w-4 h-4 text-success-500 shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Missed */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-warning-600 mb-2">What you missed</p>
                      <ul className="space-y-1.5">
                        {evaluation.missed.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-ink-muted">
                            <AlertTriangle className="w-4 h-4 text-warning-500 shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Follow-up */}
                    {evaluation.followUpPrompt && (
                      <div className="p-4 rounded-lg border border-brand-200 bg-brand-50 dark:border-brand-800/60 dark:bg-brand-950/30">
                        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 mb-1.5">Follow-up Question</p>
                        <p className="text-sm text-ink">{evaluation.followUpPrompt}</p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2">
                      <Button onClick={handleNext}>
                        Next Question <ArrowRight className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" onClick={() => { setSubmitted(false); setEvaluation(null); setAnswer(''); }}>
                        Try Again
                      </Button>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
