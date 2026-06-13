import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * Main application layout
 * This layout can be easily migrated to Next.js app/layout.tsx
 */
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-background">
      {children}
    </div>
  );
}
