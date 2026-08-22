import { useState } from 'react';
import {
  LayoutDashboard,
  Network,
  FileText,
  BookOpen,
  Layers,
  Mic,
  TrendingUp,
  Briefcase,
  Settings,
  ShieldCheck,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { Link, useRouter } from '@/router';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const mainNav: NavItem[] = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/knowledge', label: 'Knowledge Map', icon: Network },
  { to: '/app/resume', label: 'Resume', icon: FileText },
  { to: '/app/learning', label: 'Learning', icon: BookOpen },
  { to: '/app/flashcards', label: 'Flashcards', icon: Layers },
  { to: '/app/interview', label: 'Interview', icon: Mic },
  { to: '/app/progress', label: 'Progress', icon: TrendingUp },
];

const careerNav: NavItem[] = [
  { to: '/app/job-match', label: 'Job Match', icon: Briefcase },
  { to: '/app/defense', label: 'Resume Defense', icon: ShieldCheck },
];

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 7l5 11 5-11" />
          <circle cx="12" cy="18" r="1.2" fill="currentColor" stroke="none" />
        </svg>
      </div>
      <span className="font-semibold text-[15px] tracking-tight text-ink">
        Interview<span className="text-brand-600">OS</span>
      </span>
    </Link>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-subtle transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}

export function Sidebar() {
  const { path } = useRouter();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (to: string) => path === to || (to !== '/app' && path.startsWith(to));

  const NavSection = ({ items, title }: { items: NavItem[]; title?: string }) => (
    <div className="space-y-0.5">
      {title && (
        <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-ink-subtle">
          {title}
        </p>
      )}
      {items.map((item) => {
        const active = isActive(item.to);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              active
                ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
                : 'text-ink-muted hover:text-ink hover:bg-surface-subtle'
            }`}
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-surface-border bg-surface-card sticky top-0 z-40">
        <Logo />
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-ink-muted hover:bg-surface-subtle"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-surface-card border-r border-surface-border flex flex-col animate-fade-in">
            <div className="flex items-center justify-between px-4 h-14 border-b border-surface-border">
              <Logo />
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-surface-subtle">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3 space-y-6">
              <NavSection items={mainNav} />
              <NavSection items={careerNav} title="Career" />
            </nav>
            <div className="p-3 border-t border-surface-border space-y-2">
              <Link to="/app/settings" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-ink-muted hover:bg-surface-subtle">
                <Settings className="w-4 h-4" /> Settings
              </Link>
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-xs text-ink-subtle truncate">{user?.email}</span>
                <button onClick={signOut} className="p-1.5 rounded-lg text-ink-subtle hover:text-error-600 hover:bg-error-50 dark:hover:bg-error-950/30">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-surface-border bg-surface-card h-screen sticky top-0">
        <div className="flex items-center h-16 px-4 border-b border-surface-border">
          <Logo />
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-6">
          <NavSection items={mainNav} />
          <NavSection items={careerNav} title="Career" />
        </nav>
        <div className="p-3 border-t border-surface-border space-y-1">
          <Link to="/app/settings" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-ink-muted hover:bg-surface-subtle hover:text-ink">
            <Settings className="w-4 h-4" /> Settings
          </Link>
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs text-ink-subtle truncate max-w-[140px]">{user?.email}</span>
            <div className="flex items-center gap-1">
              <ThemeToggle />
              <button onClick={signOut} className="p-1.5 rounded-lg text-ink-subtle hover:text-error-600 hover:bg-error-50 dark:hover:bg-error-950/30">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export function TopBar({ title, children }: { title?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 mb-6">
      {title && <h1 className="text-xl font-semibold tracking-tight text-ink">{title}</h1>}
      <div className="flex items-center gap-2 ml-auto">
        {children}
        <div className="lg:hidden">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
