import { Controller, Get, Inject } from '@nestjs/common';
import { BloodTypeMasterService } from '@shared/sample/master/blood-type-master.service';
import { BloodTypeMasterResponse } from '@/front_bff_shared/sample/master/types/blood-type-master.api.response';

@Controller('clinical/master')
export class BloodTypeMasterController {
  constructor(@Inject(BloodTypeMasterService) private readonly bloodTypeMasterService: BloodTypeMasterService) {}

  @Get('blood-type')
  async getBloodTypeMaster(): Promise<BloodTypeMasterResponse> {
    console.log('Received request for blood type master data');
    return await this.bloodTypeMasterService.getBloodTypeMaster();
  }
}
