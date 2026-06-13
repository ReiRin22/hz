import { useState, useCallback } from 'react';
import type { VaccinationRecord } from '../types/patientInfo.type';

export function useVaccination(initial: VaccinationRecord[]) {
  const [records, setRecords] = useState<VaccinationRecord[]>(initial);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const deleteRecord = useCallback((id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const addRecord = useCallback((record: VaccinationRecord) => {
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
