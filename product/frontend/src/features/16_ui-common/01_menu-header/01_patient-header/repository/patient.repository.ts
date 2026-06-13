import { getPatientHeader } from '../api/getPatientHeader.api';
import { searchPatients } from '../api/searchPatients.api';
import { putPrescriptionStatus } from '../api/putPrescriptionStatus.api';
import { putMedicalInfoSharing } from '../api/putMedicalInfoSharing.api';
import type { PatientHeaderResponse } from '@/front_bff_shared/features/karte/patientHeader/types/response/patient-header.api.response';
import type { PatientSearchResultResponse } from '@/front_bff_shared/types/response/patient-header.response.type';
import type { PatientSearchRequest, PrescriptionStatusUpdateRequest, MedicalInfoSharingUpdateRequest } from '@/front_bff_shared/types/request/patient.request.type';

/**
 * EVT_PATIENT_LOAD: 患者ヘッダー情報取得
 * 患者詳細情報を取得する
 */
export async function fetchPatientHeader(
  patientId: string,
  signal?: AbortSignal
): Promise<PatientHeaderResponse> {
  return getPatientHeader(patientId, signal);
}

/**
 * EVT_PATIENT_SEARCH: 患者検索 + 結果取得（並列不要・単一API）
 * クエリに一致する患者一覧を返す
 */
export async function fetchPatientSearchResults(
  params: PatientSearchRequest,
  signal?: AbortSignal
): Promise<PatientSearchResultResponse> {
  return searchPatients(params, signal);
}

/**
 * EVT_PRESCRIPTION_STATUS_CHANGE: 処方箋発行形態変更
 */
export async function updatePrescriptionStatus(
  body: PrescriptionStatusUpdateRequest
): Promise<void> {
  return putPrescriptionStatus(body);
}

/**
 * EVT_MEDICAL_INFO_SHARING_CHANGE: 医療情報共有設定変更
 */
export async function updateMedicalInfoSharing(
  body: MedicalInfoSharingUpdateRequest
): Promise<void> {
  return putMedicalInfoSharing(body);
}
