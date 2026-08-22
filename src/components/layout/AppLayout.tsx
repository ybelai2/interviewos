import { type ReactNode } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-surface-bg">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
