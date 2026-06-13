import { Injectable, Inject } from '@nestjs/common';
import { KarteClient } from '@/features/karte/karte.client';
import { KarteResponse } from '@/front_bff_shared/types/response/karte.response.type';

@Injectable()
export class KarteService {
  constructor(@Inject(KarteClient) private readonly karteClient: KarteClient) {}

  async getPatients(): Promise<KarteResponse[]> {

    const patientList = await this.karteClient.fetchPatient();

    const katreResponse = patientList.map<KarteResponse>(item => {
      return { ...item }
    });

    // 3. データの整形（マッピングロジック）
    return katreResponse;
  }
}