import { useCallback } from 'react';
import { toast } from 'sonner';
import { ja } from '@/shared/i18n/ja';

const t = ja.karte.patientInfo.useToast;

export function usePatientInfoToast() {
  const showSaveSuccess = useCallback(() => {
    toast.success(t.saveSuccess);
  }, []);

  const showSaveError = useCallback(() => {
    toast.error(t.saveError);
  }, []);

  const showDeleteSuccess = useCallback(() => {
    toast.success(t.deleteSuccess);
  }, []);

  return {
    showSaveSuccess,
    showSaveError,
    showDeleteSuccess,
  };
}
