import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PatientListController } from './patient-list.controller';
import { PatientListService } from './patient-list.service';
import { PatientListClient } from './patient-list.client';

@Module({
  imports: [HttpModule],
  controllers: [PatientListController],
  providers: [PatientListService, PatientListClient],
})
export class PatientListModule {}
