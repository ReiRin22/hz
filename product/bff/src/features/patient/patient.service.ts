import { Injectable, Inject } from '@nestjs/common';
import { PatientClient } from '@/features/patient/patient.client';
import { PatientResponse } from '@/front_bff_shared/features/karte/patientInfo/types/responses/patient.response';

@Injectable()
export class PatientService {
  constructor(@Inject(PatientClient) private readonly patientClient: PatientClient) {}

  async getPatientDetail(id: string, tenantId: string): Promise<PatientResponse>{
    const patient = await this.patientClient.fetchPatient(id, tenantId);
    
    // 必要に応じてドメインサービスから返ってきたデータを加工
    return {
      ...patient,
      // フロントでそのまま <img> に使えるURLを付与
      fullImagePath: patient.imagePath
      ? `http://localhost:7121${patient.imagePath}` 
      : null,
      // 「名前 様」のような整形が必要ならここで行う
      name: patient.name
    };
  }

  async uploadPhoto(id: string, file: Express.Multer.File, tenantId: string) {
    return await this.patientClient.uploadPhoto(id, file, tenantId);
  }
}