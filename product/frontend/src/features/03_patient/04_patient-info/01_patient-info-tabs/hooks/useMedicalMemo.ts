import { useState, useCallback } from 'react';
import type { MedicalMemoRecord } from '../types/patientInfo.type';

export function useMedicalMemo(initial: MedicalMemoRecord[]) {
  const [records, setRecords] = useState<MedicalMemoRecord[]>(initial);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const deleteRecord = useCallback((id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const addRecord = useCallback((record: MedicalMemoRecord) => {
    setRecords((prev) => [...prev, record]);
  }, []);

  return {
    records,
    deleteTargetId,
    setDeleteTargetId,
    deleteRecord,
    addRecord,
  };
}
