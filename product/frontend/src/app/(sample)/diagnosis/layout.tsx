// src/app/(karte)/layout.tsx
import React from 'react';

import { ETC003PatientHeader } from '@/features/sample/common-menu-header/patient-header/components/ETC003PatientHeader';
import { ETC004LeftSidebar } from '@/features/sample/common-menu-header/left-sidebar/components/ETC004LeftSidebar';

export default function KarteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-screen">
      <header className="h-16 shrink-0">
        <ETC003PatientHeader />
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="shrink-0">
          <ETC004LeftSidebar />
        </aside>
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}