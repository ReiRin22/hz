// src/app/(karte)/diagnosis/record-management/clinical-entry/page.tsx
'use client';

import { useEffect } from 'react';
import { useStore } from '@shared/stores/use.store';
import { useClinicalEntryData } from '@/features/sample/diagnosis/record-management/clinical-entry/api/useClinicalEntryData';
import { CLT001ClinicalEntry } from '@/features/sample/diagnosis/record-management/clinical-entry/components/organisms/CLT001ClinicalEntry/index';

export default function Page() {
  // TODO: 実際のアプリケーションでは、URLパラメータや認証情報から患者IDを取得する
  const patientId = 'P-TENANT_A-001'; // 仮の患者ID

  const setPatientId = useStore((state) => state.setPatientId);
  const storedPatientId = useStore((state) => state.patientId);

  // 患者IDをストアに設定
  useEffect(() => {
    setPatientId(patientId);
  }, [patientId, setPatientId]);

  // APIからデータを取得
  const { data, isLoading, error } = useClinicalEntryData(storedPatientId);

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-slate-600">読み込み中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-red-600">エラーが発生しました</div>
          <div className="text-sm text-slate-500 mt-2">{(error as Error).message}</div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border min-h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-slate-600">データが取得できませんでした</div>
        </div>
      </div>
    );
  }

  return (
    <CLT001ClinicalEntry
      initialChiefComplaint={data.chiefComplaint}
      initialVitalInfo={data.vitalInfo}
      initialPrescriptionOrder={data.prescriptionOrder}
    />
  );
}