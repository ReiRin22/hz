'use client';

import { useState, useEffect } from 'react';
import type { GetClinicalRecordsResponse } from '@/front_bff_shared/features/karte/recordReference/types/responses/record-reference.response';
import type { MedicalRecord } from '../types/recordReference.type';

const BFF_BASE_URL = process.env.NEXT_PUBLIC_BFF_URL ?? 'http://localhost:3001';

export function useRecordReferenceData(patientId: string) {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchRecords = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const res = await fetch(`${BFF_BASE_URL}/bff/patients/${patientId}/clinical-records`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`BFF error: ${res.status}`);
        const data = (await res.json()) as GetClinicalRecordsResponse;
        // TODO: 上流 API 実装時に型を統一し as キャストを除去する
        setRecords(data.records as MedicalRecord[]);
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
        console.error('診察記録一覧の取得に失敗しました', e);
        setErrorMessage('診察記録一覧の取得に失敗しました。');
      } finally {
        setIsLoading(false);
      }
    };

    void fetchRecords();

    return () => { controller.abort(); };
  }, [patientId]);

  return { records, isLoading, errorMessage };
}
