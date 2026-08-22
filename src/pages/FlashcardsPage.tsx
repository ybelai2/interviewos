import { useEffect, useState, useCallback } from 'react';
import { RotateCcw, Check, X, ChevronLeft, ChevronRight, Layers, Sparkles } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TopBar } from '@/components/layout/Sidebar';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Skeleton } from '@/components/ui/Feedback';
import { flashcardService } from '@/services';
import type { Flashcard } from '@/types';

export function FlashcardsPage() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [reviewed, setReviewed] = useState(0);

  useEffect(() => {
    flashcardService.getFlashcards().then(setCards);
  }, []);

  const next = useCallback(() => {
    setRevealed(false);
    setIndex((i) => (i + 1) % cards.length);
    setReviewed((r) => r + 1);
  }, [cards.length]);

  const prev = useCallback(() => {
    setRevealed(false);
    setIndex((i) => (i - 1 + cards.length) % cards.length);
  }, [cards.length]);

  // Keyboard shortcuts
  useEffect(() => {
    if (cards.length === 0) return;
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setRevealed((r) => !r);
      } else if (e.key === 'ArrowRight') {
        next();
      } else if (e.key === 'ArrowLeft') {
        prev();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [cards.length, next, prev]);

  if (cards.length === 0) {
    return (
      <AppLayout>
        <TopBar title="Flashcards" />
        <Card><CardBody>
          <div className="space-y-3">
            <Skeleton className="h-48 w-full" />
          </div>
        </CardBody></Card>
      </AppLayout>
    );
  }

  const card = cards[index];
  const progress = ((index + 1) / cards.length) * 100;

  return (
    <AppLayout>
      <TopBar title="Flashcards" />

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <Badge tone="brand" className="text-[13px]">
            <Layers className="w-3.5 h-3.5" /> {card.deck}
          </Badge>
          <span className="text-sm text-ink-subtle font-mono">
            Card {index + 1} / {cards.length}
          </span>
        </div>

        <ProgressBar value={progress} size="sm" className="mb-6" />

        {/* Flashcard */}
        <div
          className="relative cursor-pointer select-none"
          onClick={() => setRevealed(!revealed)}
        >
          <Card className={`min-h-[320px] flex flex-col items-center justify-center p-8 text-center transition-all duration-300 ${revealed ? 'border-brand-500 shadow-glow' : 'hover:border-brand-400'}`}>
            {!revealed ? (
              <div className="animate-fade-in">
                <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle mb-4">Question</p>
                <p className="text-lg text-ink font-medium leading-relaxed">{card.front}</p>
                <p className="mt-8 text-xs text-ink-subtle flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Click or press <span className="kbd">Space</span> to reveal
                </p>
              </div>
            ) : (
              <div className="animate-fade-in">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 mb-4">Answer</p>
                <p className="text-base text-ink leading-relaxed">{card.back}</p>
              </div>
            )}
          </Card>
        </div>

        {/* Controls */}
        <div className="mt-6 space-y-4">
          {!revealed ? (
            <Button className="w-full" onClick={() => setRevealed(true)}>
              Reveal Answer
            </Button>
          ) : (
            <div className="grid grid-cols-4 gap-2 animate-fade-up">
              <Button variant="danger" size="md" onClick={next} className="flex-col h-auto py-3">
                <X className="w-4 h-4" />
                <span className="text-xs mt-1">Again</span>
              </Button>
              <Button variant="secondary" size="md" onClick={next} className="flex-col h-auto py-3">
                <span className="text-lg">😕</span>
                <span className="text-xs mt-1">Hard</span>
              </Button>
              <Button variant="secondary" size="md" onClick={next} className="flex-col h-auto py-3">
                <Check className="w-4 h-4 text-success-500" />
                <span className="text-xs mt-1">Good</span>
              </Button>
              <Button variant="primary" size="md" onClick={next} className="flex-col h-auto py-3">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs mt-1">Easy</span>
              </Button>
            </div>
          )}

          {/* Nav + shortcuts */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={prev}>
                <ChevronLeft className="w-4 h-4" /> Prev
              </Button>
              <Button variant="ghost" size="sm" onClick={next}>
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center gap-3 text-xs text-ink-subtle">
              <span className="flex items-center gap-1"><span className="kbd">Space</span> reveal</span>
              <span className="flex items-center gap-1"><span className="kbd">←</span> again</span>
              <span className="flex items-center gap-1"><span className="kbd">→</span> next</span>
            </div>
          </div>
        </div>

        {reviewed > 0 && (
          <p className="text-center text-xs text-ink-subtle mt-6">
            {reviewed} card{reviewed !== 1 ? 's' : ''} reviewed this session.
          </p>
        )}
      </div>
    </AppLayout>
  );
}
