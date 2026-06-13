import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TreatmentPatientListController } from './treatment-patient-list.controller';
import { TreatmentPatientListService } from './treatment-patient-list.service';
import { TreatmentPatientListClient } from './treatment-patient-list.client';

@Module({
  imports: [HttpModule],
  controllers: [TreatmentPatientListController],
  providers: [TreatmentPatientListService, TreatmentPatientListClient],
})
export class TreatmentPatientListModule {}
