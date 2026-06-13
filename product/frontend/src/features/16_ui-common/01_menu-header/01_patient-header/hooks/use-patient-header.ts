'use client';

import { useCallback, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { usePatientHeaderStore } from '../stores/use-patient-header.store';
import {
  fetchPatientHeader,
  fetchPatientSearchResults,
  updatePrescriptionStatus,
  updateMedicalInfoSharing,
} from '../repository/patient.repository';
import type { PatientViewModel } from '../types/patient-header.type';
import type { PatientHeaderResponse } from '@/front_bff_shared/features/karte/patientHeader/types/response/patient-header.api.response';
import type {
  PrescriptionStatusUpdateRequest,
  MedicalInfoSharingUpdateRequest,
} from '@/front_bff_shared/types/request/patient.request.type';

// BFF レスポンスを ViewModel にマッピング
function mapToViewModel(res: PatientHeaderResponse): PatientViewModel {
  return {
    patientId: res.patientId,
    name: res.name,
    kana: res.nameKana,
    birthDate: res.birthDate,
    gender: res.gender,
    age: res.age,
    department: res.department,
    ward: res.ward,
    room: res.room,
    doctor: res.doctor,
    allergies: res.allergies,
    infections: res.infections,
    consultationStatus: res.consultationStatus,
    prescriptionStatus: res.prescriptionStatus,
    admissionType: res.admissionType,
    isNewPatient: false,
    medicalInfoSharing: res.medicalInfoSharing,
    insurance: { type: res.insurance.type, number: '', burden: res.insurance.burden },
  };
}

/**
 * EVT_PATIENT_LOAD: 患者ヘッダー初期化フック
 * patientId が変わるたびに BFF から患者情報を取得してストアにセットする。
 * 現フェーズはモックデータで動作するため、BFF 呼び出しはエラー時にのみ影響する。
 */
export function usePatientHeaderInit(patientId: string) {
  const setPatient = usePatientHeaderStore((s) => s.setPatient);
  const setIsLoading = usePatientHeaderStore((s) => s.setIsLoading);
  const setError = usePatientHeaderStore((s) => s.setError);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!patientId) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(null);

    fetchPatientHeader(patientId, controller.signal)
      .then((res) => {
        if (controller.signal.aborted) return;
        setPatient(mapToViewModel(res));
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        const msg = err instanceof Error ? err.message : '患者情報の取得に失敗しました';
        setError(msg);
        toast.error(msg);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [patientId, setPatient, setIsLoading, setError]);
}

/**
 * ダイアログ開閉・患者選択操作フック
 */
export function usePatientHeaderActions() {
  const openDialog = usePatientHeaderStore((s) => s.openDialog);
  const closeDialog = usePatientHeaderStore((s) => s.closeDialog);
  const closeAllDialogs = usePatientHeaderStore((s) => s.closeAllDialogs);
  const setPatient = usePatientHeaderStore((s) => s.setPatient);
  const setIsLoading = usePatientHeaderStore((s) => s.setIsLoading);
  const setError = usePatientHeaderStore((s) => s.setError);

  /** ダイアログを開く */
  const handleOpenDialog = useCallback(
    (key: Parameters<typeof openDialog>[0]) => {
      openDialog(key);
    },
    [openDialog]
  );

  /** ダイアログを閉じる */
  const handleCloseDialog = useCallback(
    (key: Parameters<typeof closeDialog>[0]) => {
      closeDialog(key);
    },
    [closeDialog]
  );

  /** 全ダイアログを閉じる */
  const handleCloseAllDialogs = useCallback(() => {
    closeAllDialogs();
  }, [closeAllDialogs]);

  /**
   * EVT_PATIENT_SELECT: 患者選択
   * 患者検索ダイアログで患者を選択した後に呼ばれる。
   * BFF から新しい患者情報を取得してストアを更新する。
   */
  const handlePatientSelect = useCallback(
    async (patientId: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetchPatientHeader(patientId);
        setPatient(mapToViewModel(res));
        toast.success(`患者を切り替えました: ${res.name} (${res.patientId})`);
        closeAllDialogs();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : '患者情報の取得に失敗しました';
        setError(msg);
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [setPatient, setIsLoading, setError, closeAllDialogs]
  );

  /**
   * EVT_PATIENT_SEARCH: 患者検索
   * 検索キーワードに一致する患者一覧を返す（PatientSearchDialog 内で利用）。
   */
  const handlePatientSearch = useCallback(
    async (query: string): Promise<PatientViewModel[]> => {
      try {
        const res = await fetchPatientSearchResults({ query, limit: 20 });
        return res.patients.map(mapToViewModel);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : '患者検索に失敗しました';
        toast.error(msg);
        return [];
      }
    },
    []
  );

  return {
    handleOpenDialog,
    handleCloseDialog,
    handleCloseAllDialogs,
    handlePatientSelect,
    handlePatientSearch,
  };
}

/**
 * EVT_PRESCRIPTION_STATUS_CHANGE / EVT_MEDICAL_INFO_SHARING_CHANGE: 送信フック
 * 処方箋発行形態・医療情報共有設定の変更を BFF に送信し、ストアを楽観的更新する。
 */
export function usePatientHeaderSubmit() {
  const patient = usePatientHeaderStore((s) => s.patient);
  const setPatient = usePatientHeaderStore((s) => s.setPatient);
  const closeDialog = usePatientHeaderStore((s) => s.closeDialog);

  /**
   * EVT_PRESCRIPTION_STATUS_CHANGE: 処方箋発行形態を変更する
   */
  const handlePrescriptionStatusChange = useCallback(
    async (req: Omit<PrescriptionStatusUpdateRequest, 'patientId'>) => {
      if (!patient) return;

      // 楽観的更新
      const previous = patient;
      setPatient({ ...patient, prescriptionStatus: req.status });

      try {
        await updatePrescriptionStatus({ patientId: patient.patientId, ...req });
        toast.success('処方箋発行形態を変更しました');
        closeDialog('prescriptionSettings');
      } catch (err: unknown) {
        // ロールバック
        setPatient(previous);
        const msg = err instanceof Error ? err.message : '処方箋発行形態の変更に失敗しました';
        toast.error(msg);
      }
    },
    [patient, setPatient, closeDialog]
  );

  /**
   * EVT_MEDICAL_INFO_SHARING_CHANGE: 医療情報共有設定を変更する
   */
  const handleMedicalInfoSharingChange = useCallback(
    async (req: Omit<MedicalInfoSharingUpdateRequest, 'patientId'>) => {
      if (!patient) return;

      // 楽観的更新
      const previous = patient;
      setPatient({
        ...patient,
        medicalInfoSharing: {
          ...patient.medicalInfoSharing,
          status: req.status,
          expiryDate: req.expiryDate,
          details: req.details,
        },
      });

      try {
        await updateMedicalInfoSharing({ patientId: patient.patientId, ...req });
        toast.success('医療情報共有設定を変更しました');
        closeDialog('medicalInfoSharing');
      } catch (err: unknown) {
        // ロールバック
        setPatient(previous);
        const msg = err instanceof Error ? err.message : '医療情報共有設定の変更に失敗しました';
        toast.error(msg);
      }
    },
    [patient, setPatient, closeDialog]
  );

  return {
    handlePrescriptionStatusChange,
    handleMedicalInfoSharingChange,
  };
}
