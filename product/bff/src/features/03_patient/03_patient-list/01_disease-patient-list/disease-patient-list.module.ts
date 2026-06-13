import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DiseasePatientListController } from './disease-patient-list.controller';
import { DiseasePatientListService } from './disease-patient-list.service';
import { DiseasePatientListClient } from './disease-patient-list.client';

@Module({
  imports: [HttpModule],
  controllers: [DiseasePatientListController],
  providers: [DiseasePatientListService, DiseasePatientListClient],
})
export class DiseasePatientListModule {}
