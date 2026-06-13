import { Injectable } from '@nestjs/common';
import { axiosClient } from '@/shared/plugins/axios.client';
import { PatientResponse } from '@/front_bff_shared/types/response/patient.response.type';

@Injectable()
export class PatientClient {

  // 患者基本情報取得
  async fetchPatient(id: string, tenantId: string): Promise<PatientResponse> {
    console.log(`Fetching patient data for ID: ${id} with Tenant ID: ${tenantId}`);
    const response = await axiosClient.get<PatientResponse>(`/Patient/${id}`);
    return response.data;
  }

  // 画像アップロード (ここが重要！)
  async uploadPhoto(id: string, file: Express.Multer.File, tenantId: string) {
    // ライブラリの import は不要（消してOK）
  // 1. Node.js標準のFormDataを使用
  const form = new globalThis.FormData(); 
  
  // 2. Buffer を Uint8Array に変換（これで型の競合を回避）
  const uint8Array = new Uint8Array(file.buffer);
  
  // 3. Blob を作成（Uint8Array は BlobPart として受け入れられる）
  const blob = new Blob([uint8Array], { type: file.mimetype });
  
  // 4. ファイルを追加
  form.append('file', blob, file.originalname);

  console.log(`Sending to Backend: ID: ${id}, Tenant: ${tenantId}, File: ${file.originalname}`);

  const response = await axiosClient.post(
    `/Patient/${id}/photo`,
    form
  );
    return response.data;
  }
}