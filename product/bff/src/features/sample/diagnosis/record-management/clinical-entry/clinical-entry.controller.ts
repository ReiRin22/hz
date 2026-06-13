import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClinicalEntryService } from '@/features/sample/diagnosis/record-management/clinical-entry/clinical-entry.service';
import type { ClinicalEntryDataRequest } from '@/front_bff_shared/sample/diagnosis/record-management/clinical-entry/types/clinical-entry.api.request';
import type { ClinicalEntryDataResponse } from '@/front_bff_shared/sample/diagnosis/record-management/clinical-entry/types/clinical-entry.api.response';

@Controller('clinical/entry')
export class ClinicalEntryController {
  constructor(@Inject(ClinicalEntryService) private readonly clinicalEntryService: ClinicalEntryService) {}

  @Post()
  async getClinicalEntryData(@Body() body: ClinicalEntryDataRequest): Promise<ClinicalEntryDataResponse> {
    console.log(`Received request for clinical entry data. patientId: ${body.patientId}`);
    return await this.clinicalEntryService.getClinicalEntryData(body.patientId);
  }
}
