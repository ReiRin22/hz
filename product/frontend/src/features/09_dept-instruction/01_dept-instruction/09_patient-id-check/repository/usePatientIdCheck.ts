'use client';

import { getPatientIdCheckExpectations } from '../api/getPatientIdCheckExpectations';
import { getReasonTemplates } from '../api/getReasonTemplates';
import { getStaffByBarcode } from '../api/getStaffByBarcode';
import { postPatientIdCheck } from '../api/postPatientIdCheck';
import { postPatientConfirmReason } from '../api/postPatientConfirmReason';
import type { GetPatientIdCheckExpectationsResponse } from '@/front_bff_shared/features/dept-instruction/patient-id-check/types/responses/patientIdCheck.response';
import type { GetReasonTemplatesResponse } from '@/front_bff_shared/features/dept-instruction/patient-id-check/types/responses/patientIdCheck.response';
import type { PostPatientIdCheckCompleteRequest } from '@/front_bff_shared/features/dept-instruction/patient-id-check/types/requests/patientIdCheck.request';
import type { PostPatientConfirmReasonRequest } from '@/front_bff_shared/features/dept-instruction/patient-id-check/types/requests/patientIdCheck.request';
import type { PostPatientIdCheckCompleteResponse } from '@/front_bff_shared/features/dept-instruction/patient-id-check/types/responses/patientIdCheck.response';
import type { PostPatientConfirmReasonResponse } from '@/front_bff_shared/features/dept-instruction/patient-id-check/types/responses/patientIdCheck.response';
import type { GetStaffByBarcodeResponse } from '@/front_bff_shared/features/dept-instruction/patient-id-check/types/responses/patientIdCheck.response';

/** 初期表示: 期待値と理由定型文を並列取得 */
export async function fetchPatientIdCheckInit(orderId: string): Promise<{
  expectations: GetPatientIdCheckExpectationsResponse;
  reasonTemplates: GetReasonTemplatesResponse;
}> {
  const [expectations, reasonTemplates] = await Promise.all([
    getPatientIdCheckExpectations(orderId),
    getReasonTemplates(),
  ]);
  return { expectations, reasonTemplates };
}

/** 実施者バーコードから職員情報を取得 */
export async function fetchStaffByBarcode(
  barcode: string,
): Promise<GetStaffByBarcodeResponse> {
  return getStaffByBarcode(barcode);
}

/** 3点チェック完了登録 */
export async function executePatientIdCheck(
  orderId: string,
  request: Omit<PostPatientIdCheckCompleteRequest, 'orderId'>,
): Promise<PostPatientIdCheckCompleteResponse> {
  return postPatientIdCheck(orderId, request);
}

/** 本人確認理由の保存 */
export async function executePatientConfirmReason(
  orderId: string,
  request: Omit<PostPatientConfirmReasonRequest, 'orderId'>,
): Promise<PostPatientConfirmReasonResponse> {
  return postPatientConfirmReason(orderId, request);
}
