'use client';

import { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { PatientHeaderOrganism } from '@/shared/components/organisms/patient-header/PatientHeaderOrganism';
import { KarteTabs } from '@/shared/components/molecules/karte-tabs';
import ETC005Page from '@/shared/components/organisms/right-sidemenu/ETC005Page';

export default function Karte1Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // URL から患者ID を抽出
  const extractPatientId = (): string | null => {
    const match = pathname.match(/\/karte1\/([^\/]+)/);
    return match ? match[1] : null;
  };

  const patientId = extractPatientId();

  // 患者一覧画面かどうかを判定
  const isPatientListPage = pathname.includes('/diagnosis/patient-list');

  // 患者ヘッダーに渡す患者ID（"no-patient" の場合は null として扱う）
  const headerPatientId = patientId === 'no-patient' ? null : patientId;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* 患者一覧画面以外は患者ヘッダーを表示 */}
      {!isPatientListPage && (
        <Suspense fallback={<div style={{ height: '80px' }} />}>
          <PatientHeaderOrganism />
        </Suspense>
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* タブ（患者一覧画面では非表示） */}
          {!isPatientListPage && <KarteTabs />}

          {/* メインコンテンツ */}
          <div className="flex-1 overflow-auto">{children}</div>
        </div>

        {/* 右メニュー */}
        <ETC005Page />
      </div>
    </div>
  );
}
