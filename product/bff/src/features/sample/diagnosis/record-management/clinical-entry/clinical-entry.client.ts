import { Injectable } from '@nestjs/common';
import type { ChiefComplaintData } from './types/chief-complaint.type';
import type { ChiefComplaintRequest } from './types/chief-complaint.request.type';
import type { VitalInfoData } from './types/vital-info.type';
import type { VitalInfoRequest } from './types/vital-info.request.type';
import type { PrescriptionOrderData } from './types/prescription.type';
import type { PrescriptionOrderRequest } from './types/prescription.request.type';
import { axiosClient } from '@shared/plugins/bffAxiosClient';

@Injectable()
export class ClinicalEntryClient {

  // 主訴取得（ハードコーディング）
  async fetchChiefComplaint(request: ChiefComplaintRequest): Promise<ChiefComplaintData> {
    console.log(`Fetching chief complaint for patientId: ${request.patientId}`);
    const response = await axiosClient.post<ChiefComplaintData>(
      '/clinical/entry/chief-complaint',
      request
    );
    return response.data;
  }

  // バイタル情報取得（ハードコーディング）
  async fetchVitalInfo(request: VitalInfoRequest): Promise<VitalInfoData> {
    console.log(`Fetching vital info for patientId: ${request.patientId}`);
    const response = await axiosClient.post<VitalInfoData>(
      '/clinical/entry/vital-info',
      request
    );
    return response.data;
  }

  // 処方箋取得（ハードコーディング）
  async fetchPrescriptionOrder(request: PrescriptionOrderRequest): Promise<PrescriptionOrderData> {
    console.log(`Fetching prescription order for patientId: ${request.patientId}`);
    const response = await axiosClient.post<PrescriptionOrderData>(
      '/clinical/entry/prescription-order',
      request
    );
    return response.data;
  }
}
