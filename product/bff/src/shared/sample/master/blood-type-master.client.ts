import { Injectable } from '@nestjs/common';
import { BloodTypeOption } from '@/front_bff_shared/sample/master/types/blood-type-master.api.response';
import { axiosClient } from '@shared/plugins/bffAxiosClient';

@Injectable()
export class BloodTypeMasterClient {

  // 血液型マスタ取得
  async fetchBloodTypes(): Promise<BloodTypeOption[]> {
    console.log('Fetching blood types');
    const response = await axiosClient.get<BloodTypeOption[]>('/master/blood-type/types');
    return response.data;
  }

  // Rh因子マスタ取得
  async fetchRhFactors(): Promise<BloodTypeOption[]> {
    console.log('Fetching Rh factors');
    const response = await axiosClient.get<BloodTypeOption[]>('/master/blood-type/rh-factors');
    return response.data;
  }
}
