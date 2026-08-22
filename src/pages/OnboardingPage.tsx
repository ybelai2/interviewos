import { useState, useCallback, type DragEvent } from 'react';
import { UploadCloud, FileText, X, ArrowRight } from 'lucide-react';
import { Link, useRouter } from '@/router';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ProgressSteps, useAnimatedSteps } from '@/components/ui/ProgressSteps';

type Phase = 'upload' | 'analyzing' | 'done';

const analysisSteps = [
  { label: 'Reading experience' },
  { label: 'Extracting technologies' },
  { label: 'Identifying projects' },
  { label: 'Analyzing technical claims' },
  { label: 'Building knowledge map' },
  { label: 'Generating interview roadmap' },
];

export function OnboardingPage() {
  const { navigate } = useRouter();
  const [phase, setPhase] = useState<Phase>('upload');
  const [fileName, setFileName] = useState('');
  const [dragging, setDragging] = useState(false);

  const { currentStep, isDone } = useAnimatedSteps(
    analysisSteps.map((s) => s.label),
    850
  );

  const handleFile = useCallback((name: string) => {
    setFileName(name);
    setPhase('analyzing');
  }, []);

  // When analysis completes, navigate to resume analysis page
  if (phase === 'analyzing' && isDone && currentStep >= analysisSteps.length) {
    setTimeout(() => navigate('/app/resume'), 400);
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file.name);
  };

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col">
      <div className="px-4 h-16 flex items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 7l5 11 5-11" />
            </svg>
          </div>
          <span className="font-semibold text-[15px] tracking-tight text-ink">InterviewOS</span>
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-lg">
          {phase === 'upload' && (
            <div className="animate-fade-up">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-semibold tracking-tight text-ink">
                  Welcome to InterviewOS.
                </h1>
                <p className="mt-2 text-ink-muted">Let's build your interview roadmap.</p>
              </div>

              <Card className="p-6">
                <p className="text-sm font-medium text-ink mb-1">Step 1: Upload your resume</p>
                <p className="text-xs text-ink-subtle mb-5">Supported formats: PDF, DOCX</p>

                <div
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                  className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
                    dragging ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30' : 'border-surface-border-strong hover:border-brand-400'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center mx-auto mb-4">
                    <UploadCloud className="w-6 h-6 text-brand-600" />
                  </div>
                  <p className="text-sm font-medium text-ink mb-1">Drop your resume here</p>
                  <p className="text-xs text-ink-subtle mb-4">or</p>
                  <label className="inline-block">
                    <input
                      type="file"
                      accept=".pdf,.docx"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFile(f.name);
                      }}
                    />
                    <Button variant="outline" size="sm" asChild>
                      <span>Browse Files</span>
                    </Button>
                  </label>
                </div>

                <p className="text-xs text-ink-subtle mt-4 text-center">
                  Your resume is processed privately and never shared.
                </p>
              </Card>

              <div className="text-center mt-4">
                <Link to="/app" className="text-sm text-ink-subtle hover:text-ink">
                  Skip for now and explore the demo →
                </Link>
              </div>
            </div>
          )}

          {phase === 'analyzing' && (
            <div className="animate-fade-up">
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-full bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-7 h-7 text-brand-600" />
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-ink">
                  Analyzing your resume...
                </h1>
                {fileName && (
                  <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-lg bg-surface-subtle text-xs text-ink-muted">
                    <FileText className="w-3.5 h-3.5" />
                    {fileName}
                  </div>
                )}
              </div>

              <Card className="p-6">
                <ProgressSteps steps={analysisSteps} currentStep={currentStep} />
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
