import { useState, useCallback } from 'react';
import type { LifestyleRecord } from '../types/patientInfo.type';

export function useLifestyle(initial: LifestyleRecord) {
  const [record, setRecord] = useState<LifestyleRecord>(initial);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<LifestyleRecord>(initial);

  const startEdit = useCallback(() => {
    setDraft(record);
    setIsEditing(true);
  }, [record]);

  const cancelEdit = useCallback(() => {
    setDraft(record);
    setIsEditing(false);
  }, [record]);

  const saveEdit = useCallback(() => {
    setRecord(draft);
    setIsEditing(false);
  }, [draft]);

  return {
    record,
    isEditing,
    draft,
    setDraft,
    startEdit,
    cancelEdit,
    saveEdit,
  };
}
