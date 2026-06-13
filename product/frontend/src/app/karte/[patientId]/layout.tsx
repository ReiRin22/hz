'use client';

import { Suspense } from 'react';
import { PatientHeaderOrganism } from '@/shared/components/organisms/patient-header/PatientHeaderOrganism';
import { KarteTabs } from '@/shared/components/molecules/karte-tabs';
import { GlobalMenuNavFeature } from '@/shared/components/organisms/left-sidemenu/GlobalMenuNavFeature';
import { RightSideMenuWrapper } from '@/shared/components/organisms/right-sidemenu/RightSideMenuWrapper';

export default function KartePatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Suspense fallback={<div style={{ height: '80px' }} />}>
        <PatientHeaderOrganism />
      </Suspense>

      <div className="flex flex-1 overflow-hidden">
        <GlobalMenuNavFeature />

        <div className="flex flex-col flex-1 overflow-hidden">
          <KarteTabs />
          <div className="flex-1 overflow-auto">{children}</div>
        </div>

        <RightSideMenuWrapper />
      </div>
    </div>
  );
}
