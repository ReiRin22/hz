import { useState, useEffect } from 'react';
import { Patient } from '../../../lib/types';
import { patientsService } from '../api/patients-service';

export function usePatient(patientId?: string) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!patientId) {
      setLoading(false);
      return;
    }

    const fetchPatient = async () => {
      try {
        setLoading(true);
        const data = await patientsService.getPatientById(patientId);
        setPatient(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch patient'));
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [patientId]);

  return {
    patient,
    loading,
    error
  };
}
