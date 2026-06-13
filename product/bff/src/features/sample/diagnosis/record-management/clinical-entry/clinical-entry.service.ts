import { Injectable, Inject } from '@nestjs/common';
import { ClinicalEntryClient } from '@/features/sample/diagnosis/record-management/clinical-entry/clinical-entry.client';
import { ClinicalEntryDataResponse } from '@/front_bff_shared/sample/diagnosis/record-management/clinical-entry/types/clinical-entry.api.response';

@Injectable()
export class ClinicalEntryService {
  constructor(@Inject(ClinicalEntryClient) private readonly clinicalEntryClient: ClinicalEntryClient) {}

  async getClinicalEntryData(patientId: string): Promise<ClinicalEntryDataResponse> {
    const [chiefComplaintData, vitalInfoData, prescriptionOrderData] = await Promise.all([
      this.clinicalEntryClient.fetchChiefComplaint({ patientId }),
      this.clinicalEntryClient.fetchVitalInfo({ patientId }),
      this.clinicalEntryClient.fetchPrescriptionOrder({ patientId }),
    ]);

    // 構造化された処方データを文字列に結合（drugNameには用量が含まれる）
    const formattedOrders = prescriptionOrderData.orders.map(order =>
      `${order.drug.drugName} ${order.frequency} ${order.timing} ${order.duration}`
    );

    return {
      chiefComplaint: chiefComplaintData.text,
      vitalInfo: {
        bloodPressure: vitalInfoData.bloodPressure ?? '',
        bloodType: vitalInfoData.bloodType ?? '',
        rhFactor: vitalInfoData.rhFactor ?? '',
      },
      prescriptionOrder: {
        orders: formattedOrders,
      },
    };
  }
}
