import { Injectable, Inject } from '@nestjs/common';
import { BloodTypeMasterClient } from '@shared/sample/master/blood-type-master.client';
import { BloodTypeMasterResponse } from '@/front_bff_shared/sample/master/types/blood-type-master.api.response';

@Injectable()
export class BloodTypeMasterService {
  constructor(@Inject(BloodTypeMasterClient) private readonly bloodTypeMasterClient: BloodTypeMasterClient) {}

  async getBloodTypeMaster(): Promise<BloodTypeMasterResponse> {
    const [bloodTypes, rhFactors] = await Promise.all([
      this.bloodTypeMasterClient.fetchBloodTypes(),
      this.bloodTypeMasterClient.fetchRhFactors(),
    ]);

    return {
      bloodTypes,
      rhFactors,
    };
  }
}
