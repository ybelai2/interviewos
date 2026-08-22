import { Check, ArrowRight } from 'lucide-react';
import { Link } from '@/router';
import { MarketingNav } from '@/components/layout/MarketingNav';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Get started with the basics.',
    features: [
      '1 resume',
      'Basic skill analysis',
      'Limited questions',
      'Basic flashcards',
      'Limited learning resources',
    ],
    cta: 'Get Started',
    to: '/signup',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$12',
    period: '/month',
    description: 'Everything you need to ace interviews.',
    features: [
      'Multiple resumes',
      'Unlimited practice',
      'Resume Defense',
      'Mock interviews',
      'Advanced analytics',
      'Personalized learning roadmap',
      'Job matching',
    ],
    cta: 'Start with Pro',
    to: '/signup',
    highlighted: true,
  },
];

export function PricingPage() {
  return (
    <div className="min-h-screen bg-surface-bg">
      <MarketingNav />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center mb-12">
          <p className="section-eyebrow mb-2">Pricing</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink">
            Simple, transparent pricing
          </h1>
          <p className="mt-3 text-ink-muted max-w-md mx-auto">
            Start free. Upgrade when you're ready to go all-in on interview prep.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`p-7 relative ${plan.highlighted ? 'border-brand-500 shadow-glow' : ''}`}
            >
              {plan.highlighted && (
                <Badge tone="brand" className="absolute -top-3 left-7">
                  Most Popular
                </Badge>
              )}
              <h3 className="text-lg font-semibold text-ink">{plan.name}</h3>
              <p className="text-sm text-ink-muted mt-1">{plan.description}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-ink tracking-tight">{plan.price}</span>
                <span className="text-sm text-ink-subtle">{plan.period}</span>
              </div>
              <Link to={plan.to} className="block mt-6">
                <Button
                  variant={plan.highlighted ? 'primary' : 'outline'}
                  className="w-full"
                >
                  {plan.cta} <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <ul className="mt-7 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-ink-muted">
                    <Check className="w-4 h-4 text-success-500 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <p className="text-center text-xs text-ink-subtle mt-8">
          Prices shown in USD. Payment integration coming soon.
        </p>
      </div>
    </div>
  );
}
