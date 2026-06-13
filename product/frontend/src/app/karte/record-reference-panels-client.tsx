'use client'

import { useState } from 'react';
import { HistoricalRecordsPanel, RecordDetailPanel } from '@/features/12_karte-core/04_karte-chart/recordReference';
import type { MedicalRecord } from '@/features/12_karte-core/04_karte-chart/recordReference';
import { useRecordReferenceData } from '@/features/12_karte-core/04_karte-chart/recordReference/hooks/useRecordReferenceData';

/** TODO: 認証セッションから取得する */
const PATIENT_ID = 'P001';

export function RecordReferencePanelsClient() {
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | MedicalRecord[] | null>(null);
  const { records, isLoading, errorMessage } = useRecordReferenceData(PATIENT_ID);

  if (isLoading) {
    return <div className="rrc-loading-state" role="status" aria-live="polite">読み込み中...</div>;
  }

  if (errorMessage) {
    return <div className="rrc-error-state" role="alert">{errorMessage}</div>;
  }

  return (
    <>
      <HistoricalRecordsPanel
        records={records}
        onRecordSelect={setSelectedRecord}
      />
      <RecordDetailPanel
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />
    </>
  );
}
