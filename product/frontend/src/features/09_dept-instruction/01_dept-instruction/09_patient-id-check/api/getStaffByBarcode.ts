'use client';

import { axiosClient } from '@/shared/plugins/axiosClient';
import type { GetStaffByBarcodeResponse } from '@/front_bff_shared/features/dept-instruction/patient-id-check/types/responses/patientIdCheck.response';

export async function getStaffByBarcode(barcode: string): Promise<GetStaffByBarcodeResponse> {
  const response = await axiosClient.get<GetStaffByBarcodeResponse>(
    `/dept-instructions/patient-id-check/staff/${encodeURIComponent(barcode)}`,
  );
  return response.data;
}
