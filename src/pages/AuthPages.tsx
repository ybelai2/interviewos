import { useState, type FormEvent } from 'react';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Link, useRouter } from '@/router';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input, Label } from '@/components/ui/Input';
import { Callout } from '@/components/ui/Callout';

function AuthShell({ title, subtitle, children, footer }: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-bg flex flex-col">
      <div className="px-4 h-16 flex items-center">
        <Link to="/" className="flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-lg bg-brand-600 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 7l5 11 5-11" />
                  <circle cx="12" cy="18" r="1.2" fill="currentColor" stroke="none" />
                </svg>
              </div>
              <span className="font-semibold text-lg tracking-tight text-ink">
                Interview<span className="text-brand-600">OS</span>
              </span>
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight text-ink">{title}</h1>
            <p className="mt-2 text-sm text-ink-muted">{subtitle}</p>
          </div>
          <Card className="p-6">
            {children}
          </Card>
          <p className="text-center text-sm text-ink-muted mt-6">{footer}</p>
        </div>
      </div>
    </div>
  );
}

export function SignInPage() {
  const { signIn } = useAuth();
  const { navigate } = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    signIn(email);
    navigate('/onboarding');
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue your interview prep."
      footer={<>Don't have an account? <Link to="/signup" className="text-brand-600 font-medium hover:underline">Sign up</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Callout tone="error">{error}</Callout>}
        <div>
          <Label>Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
            <Input type="email" placeholder="you@example.com" className="pl-9" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <Label className="mb-0">Password</Label>
            <Link to="/forgot" className="text-xs text-brand-600 hover:underline">Forgot?</Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
            <Input type={showPw ? 'text' : 'password'} placeholder="••••••••" className="pl-9 pr-9" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink">
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <Button type="submit" className="w-full">Sign In</Button>
        <p className="text-xs text-center text-ink-subtle">
          Demo mode — any email and password will work.
        </p>
      </form>
    </AuthShell>
  );
}

export function SignUpPage() {
  const { signUp } = useAuth();
  const { navigate } = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    signUp(email, name);
    navigate('/onboarding');
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start mastering your resume today."
      footer={<>Already have an account? <Link to="/signin" className="text-brand-600 font-medium hover:underline">Sign in</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Callout tone="error">{error}</Callout>}
        <div>
          <Label>Full name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
            <Input placeholder="Alex Chen" className="pl-9" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
            <Input type="email" placeholder="you@example.com" className="pl-9" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <div>
          <Label>Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
            <Input type="password" placeholder="At least 8 characters" className="pl-9" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>
        <Button type="submit" className="w-full">Create Account</Button>
        <p className="text-xs text-center text-ink-subtle">
          By signing up, you agree to our Terms and Privacy Policy.
        </p>
      </form>
    </AuthShell>
  );
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <AuthShell
      title="Reset password"
      subtitle="We'll send you a link to reset your password."
      footer={<>Remember your password? <Link to="/signin" className="text-brand-600 font-medium hover:underline">Sign in</Link></>}
    >
      {sent ? (
        <Callout tone="success" title="Check your email">
          If an account exists for {email}, you'll receive a reset link shortly.
        </Callout>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
              <Input type="email" placeholder="you@example.com" className="pl-9" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <Button type="submit" className="w-full">Send Reset Link</Button>
        </form>
      )}
    </AuthShell>
  );
}
