import { useState, useCallback } from 'react';
import type { PhilosophyRecord } from '../types/patientInfo.type';

export function useAcp(initial: PhilosophyRecord[]) {
  const [records, setRecords] = useState<PhilosophyRecord[]>(initial);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<PhilosophyRecord | null>(
    initial.find((r) => r.isLatest) ?? null,
  );

  const startEdit = useCallback(() => {
    const latest = records.find((r) => r.isLatest) ?? null;
    setDraft(latest);
    setIsEditing(true);
  }, [records]);

  const cancelEdit = useCallback(() => {
    setIsEditing(false);
    setDraft(records.find((r) => r.isLatest) ?? null);
  }, [records]);

  const saveEdit = useCallback(() => {
    if (!draft) return;
    setRecords((prev) =>
      prev.map((r) => (r.isLatest ? { ...draft, isLatest: true } : r)),
    );
    setIsEditing(false);
  }, [draft]);

  return {
    records,
    isEditing,
    draft,
    setDraft,
    startEdit,
    cancelEdit,
    saveEdit,
  };
}
