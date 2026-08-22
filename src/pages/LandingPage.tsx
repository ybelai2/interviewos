import { ArrowRight, CheckCircle2, FileText, Network, BookOpen, ShieldCheck, Mic, Layers, Brain, TrendingUp } from 'lucide-react';
import { Link } from '@/router';
import { MarketingNav } from '@/components/layout/MarketingNav';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar, MasteryBar } from '@/components/ui/ProgressBar';

function HeroDashboard() {
  const skills = [
    { name: 'Java', value: 82 },
    { name: 'Spring Boot', value: 74 },
    { name: 'AWS', value: 61 },
    { name: 'System Design', value: 42 },
  ];
  return (
    <Card className="w-full max-w-md p-6 shadow-pop animate-fade-up" style={{ animationDelay: '0.15s' }}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs text-ink-subtle font-medium uppercase tracking-wider">Interview Readiness</p>
          <p className="text-3xl font-bold text-ink mt-1">72%</p>
        </div>
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" strokeWidth="6" className="stroke-surface-subtle" />
            <circle
              cx="32" cy="32" r="28" fill="none" strokeWidth="6"
              strokeLinecap="round"
              className="stroke-brand-500 transition-all duration-1000"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - 0.72)}`}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-ink">72</span>
        </div>
      </div>
      <div className="space-y-3">
        {skills.map((s) => (
          <div key={s.name}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-ink-muted font-medium">{s.name}</span>
              <span className="text-ink-subtle font-mono">{s.value}%</span>
            </div>
            <MasteryBar value={s.value} size="sm" />
          </div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-surface-border">
        <div className="flex items-center justify-between">
          <span className="text-xs text-ink-subtle">Resume Claims</span>
          <Badge tone="brand">18 / 27 mastered</Badge>
        </div>
      </div>
    </Card>
  );
}

const steps = [
  { num: '01', text: 'Upload your resume' },
  { num: '02', text: 'InterviewOS analyzes your technical experience' },
  { num: '03', text: 'Build your personalized knowledge map' },
  { num: '04', text: 'Learn your weak areas' },
  { num: '05', text: 'Practice realistic interview questions' },
  { num: '06', text: 'Defend every claim on your resume' },
];

const features = [
  {
    icon: Brain,
    title: 'Resume Intelligence',
    desc: "Don't just extract keywords. Understand what you claim to know.",
  },
  {
    icon: TrendingUp,
    title: 'Adaptive Learning',
    desc: 'Learn exactly what you need to know next.',
  },
  {
    icon: ShieldCheck,
    title: 'Resume Defense',
    desc: 'Practice the questions an interviewer could ask about your experience.',
  },
  {
    icon: Network,
    title: 'Technical Knowledge Map',
    desc: 'Visualize your technologies and related concepts.',
  },
  {
    icon: Mic,
    title: 'Mock Interviews',
    desc: 'Practice realistic technical interviews.',
  },
  {
    icon: BookOpen,
    title: 'Learning Resources',
    desc: 'Find documentation, videos, articles, and tutorials relevant to your gaps.',
  },
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-bg">
      <MarketingNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-500/8 dark:bg-brand-500/10 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="animate-fade-up">
              <Badge tone="brand" className="mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse-soft" />
                AI-powered interview prep
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink leading-[1.05]">
                Master everything
                <br />
                <span className="text-brand-600">on your resume.</span>
              </h1>
              <p className="mt-5 text-lg text-ink-muted max-w-md leading-relaxed">
                Turn your resume into a personalized technical curriculum, interview simulator, and knowledge map.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link to="/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Analyze My Resume <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <a href="#how">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    See How It Works
                  </Button>
                </a>
              </div>
              <p className="mt-6 text-xs text-ink-subtle flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-success-500" />
                No credit card required. Free plan available.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <HeroDashboard />
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-surface-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-14">
            <p className="section-eyebrow mb-2">How It Works</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
              From resume to mastery in six steps
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {steps.map((step, i) => (
              <Card key={i} hover className="p-5 animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <span className="font-mono text-xs font-semibold text-brand-600">{step.num}</span>
                <p className="mt-2 text-sm text-ink leading-relaxed">{step.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="product" className="border-t border-surface-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-14">
            <p className="section-eyebrow mb-2">Features</p>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink">
              Built for serious interview prep
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <Card key={i} hover className="p-6 animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="w-10 h-10 rounded-lg bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-brand-600" />
                </div>
                <h3 className="text-sm font-semibold text-ink mb-1.5">{f.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-surface-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <Card className="p-10 lg:p-16 text-center bg-gradient-to-br from-brand-50 to-surface-card dark:from-brand-950/30 dark:to-surface-card">
            <FileText className="w-10 h-10 text-brand-600 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-ink max-w-lg mx-auto">
              Make it difficult for an interviewer to ask something you can't explain.
            </h2>
            <p className="mt-3 text-ink-muted max-w-md mx-auto">
              Upload your resume and get a personalized interview roadmap in minutes.
            </p>
            <Link to="/signup" className="inline-block mt-6">
              <Button size="lg">
                Analyze My Resume <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 7l5 11 5-11" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-ink">InterviewOS</span>
          </div>
          <p className="text-xs text-ink-subtle">Master everything on your resume.</p>
          <div className="flex items-center gap-5 text-xs text-ink-muted">
            <Link to="/pricing" className="hover:text-ink">Pricing</Link>
            <Link to="/signin" className="hover:text-ink">Sign In</Link>
            <Link to="/signup" className="hover:text-ink">Get Started</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
