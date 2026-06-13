'use client';

import { useState, useEffect } from 'react';
import { getReceptionPatients } from '../api/getReceptionPatients.api';
import type { Patient } from '../types/receptionPatientList.types';

interface UseReceptionPatientsResult {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  isLoading: boolean;
  fetchError: string | null;
}

export function useReceptionPatients(date: string): UseReceptionPatientsResult {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setFetchError(null);
    getReceptionPatients(date, controller.signal)
      .then((data) => {
        setPatients(data.patients);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if ((err as Error).name !== 'AbortError') {
          setFetchError('受診者一覧の取得に失敗しました。再読み込みしてください。');
          setIsLoading(false);
        }
      });
    return () => controller.abort();
  }, [date]);

  return { patients, setPatients, isLoading, fetchError };
}
