import { useState, useCallback } from 'react';
import type { AllergyHistoryData, AllergyRecord, MedicalHistoryRecord, SurgeryRecord } from '../types/patientInfo.type';

export function useAllergyHistory(initial: AllergyHistoryData) {
  const [data, setData] = useState<AllergyHistoryData>(initial);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'allergy' | 'history' | 'surgery'; id: string } | null>(null);

  const deleteAllergy = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      allergies: prev.allergies.filter((r) => r.id !== id),
    }));
  }, []);

  const deleteMedicalHistory = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      medicalHistories: prev.medicalHistories.filter((r) => r.id !== id),
    }));
  }, []);

  const deleteSurgery = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      surgeries: prev.surgeries.filter((r) => r.id !== id),
    }));
  }, []);

  const addAllergy = useCallback((record: AllergyRecord) => {
    setData((prev) => ({
      ...prev,
      allergies: [...prev.allergies, record],
    }));
  }, []);

  const addMedicalHistory = useCallback((record: MedicalHistoryRecord) => {
    setData((prev) => ({
      ...prev,
      medicalHistories: [...prev.medicalHistories, record],
    }));
  }, []);

  const addSurgery = useCallback((record: SurgeryRecord) => {
    setData((prev) => ({
      ...prev,
      surgeries: [...prev.surgeries, record],
    }));
  }, []);

  return {
    data,
    deleteTarget,
    setDeleteTarget,
    deleteAllergy,
    deleteMedicalHistory,
    deleteSurgery,
    addAllergy,
    addMedicalHistory,
    addSurgery,
  };
}
