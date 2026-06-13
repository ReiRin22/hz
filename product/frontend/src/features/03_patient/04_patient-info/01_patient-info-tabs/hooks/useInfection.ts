import { useState, useCallback } from 'react';
import type { InfectionRecord } from '../types/patientInfo.type';

export function useInfection(initial: InfectionRecord[]) {
  const [records, setRecords] = useState<InfectionRecord[]>(initial);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const deleteRecord = useCallback((id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const addRecord = useCallback((record: InfectionRecord) => {
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
