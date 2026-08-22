import { Sun, Moon } from 'lucide-react';
import { Link } from '@/router';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/Button';

export function MarketingNav() {
  const { theme, toggle } = useTheme();
  return (
    <header className="sticky top-0 z-40 border-b border-surface-border/80 bg-surface-bg/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 7l5 11 5-11" />
              <circle cx="12" cy="18" r="1.2" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <span className="font-semibold text-[15px] tracking-tight text-ink">
            Interview<span className="text-brand-600">OS</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-ink-muted">
          <a href="#product" className="hover:text-ink transition-colors">Product</a>
          <a href="#how" className="hover:text-ink transition-colors">How It Works</a>
          <Link to="/pricing" className="hover:text-ink transition-colors">Pricing</Link>
          <Link to="/signin" className="hover:text-ink transition-colors">Sign In</Link>
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={toggle} className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-subtle transition-colors">
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <Link to="/signup">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
