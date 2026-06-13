'use client';

// PatientInfoTabsFeature 自体が 'use client' 境界を持つが、
// このラッパーは Server Component である page.tsx との境界を明示するために存在する。
// 将来的に Suspense / ErrorBoundary をここに追加することを想定している。
import { PatientInfoTabsFeature } from '@/features/03_patient/04_patient-info/01_patient-info-tabs';
import type { PatientInfoData, UserRole } from '@/features/03_patient/04_patient-info/01_patient-info-tabs';

interface PatientInfoClientProps {
  initialData: PatientInfoData;
  userRole: UserRole;
}

export function PatientInfoClient({ initialData, userRole }: PatientInfoClientProps) {
  return <PatientInfoTabsFeature initialData={initialData} userRole={userRole} />;
}
