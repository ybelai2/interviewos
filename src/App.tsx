import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { useRouter, RouterProvider } from '@/router';

import { LandingPage } from '@/pages/LandingPage';
import {
  SignInPage,
  SignUpPage,
  ForgotPasswordPage,
} from '@/pages/AuthPages';

import { PricingPage } from '@/pages/PricingPage';
import { OnboardingPage } from '@/pages/OnboardingPage';

import { DashboardPage } from '@/pages/DashboardPage';
import { KnowledgeMapPage } from '@/pages/KnowledgeMapPage';
import { ResumePage } from '@/pages/ResumePage';
import { LearningPage } from '@/pages/LearningPage';
import { FlashcardsPage } from '@/pages/FlashcardsPage';
import { InterviewPage } from '@/pages/InterviewPage';
import { ResumeDefensePage } from '@/pages/ResumeDefensePage';

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-sm text-ink-subtle mb-2">
          InterviewOS
        </p>

        <h1 className="text-2xl font-semibold text-ink">
          Page not found
        </h1>

        <p className="text-sm text-ink-muted mt-2">
          The page you're looking for doesn't exist yet.
        </p>

        <a
          href="#/"
          className="inline-block mt-6 px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}

function ComingSoonPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-sm font-medium text-brand-600 mb-2">
          InterviewOS
        </p>

        <h1 className="text-2xl font-semibold text-ink">
          {title}
        </h1>

        <p className="text-sm text-ink-muted mt-3">
          This section is present in the navigation but its page
          implementation has not been created yet.
        </p>

        <a
          href="#/app"
          className="inline-block mt-6 px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          Back to Dashboard
        </a>
      </div>
    </div>
  );
}

function AppRoutes() {
  const { path } = useRouter();

  switch (path) {
    // Marketing
    case '/':
      return <LandingPage />;

    case '/pricing':
      return <PricingPage />;

    // Authentication
    case '/signin':
      return <SignInPage />;

    case '/signup':
      return <SignUpPage />;

    case '/forgot':
      return <ForgotPasswordPage />;

    // Onboarding
    case '/onboarding':
      return <OnboardingPage />;

    // Main application
    case '/app':
      return <DashboardPage />;

    case '/app/knowledge':
      return <KnowledgeMapPage />;

    case '/app/resume':
      return <ResumePage />;

    case '/app/learning':
      return <LearningPage />;

    case '/app/flashcards':
      return <FlashcardsPage />;

    case '/app/interview':
      return <InterviewPage />;

    case '/app/defense':
      return <ResumeDefensePage />;

    // These routes exist in the sidebar,
    // but their page components were not generated.
    case '/app/progress':
      return <ComingSoonPage title="Progress" />;

    case '/app/job-match':
      return <ComingSoonPage title="Job Match" />;

    default:
      return <NotFoundPage />;
  }
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider>
          <AppRoutes />
        </RouterProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;