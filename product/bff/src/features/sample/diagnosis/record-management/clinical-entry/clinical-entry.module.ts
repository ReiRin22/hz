import { Module } from '@nestjs/common';
import { ClinicalEntryController } from '@/features/sample/diagnosis/record-management/clinical-entry/clinical-entry.controller';
import { ClinicalEntryService } from '@/features/sample/diagnosis/record-management/clinical-entry/clinical-entry.service';
import { ClinicalEntryClient } from '@/features/sample/diagnosis/record-management/clinical-entry/clinical-entry.client';

@Module({
  controllers: [ClinicalEntryController],
  providers: [
    ClinicalEntryService,
    ClinicalEntryClient,
  ],
})
export class ClinicalEntryModule {}
