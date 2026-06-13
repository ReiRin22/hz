import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PatientBasicViewController } from './patient-basic-view.controller';
import { PatientBasicViewService } from './patient-basic-view.service';
import { PatientBasicViewClient } from './patient-basic-view.client';

@Module({
  imports: [HttpModule],
  controllers: [PatientBasicViewController],
  providers: [PatientBasicViewService, PatientBasicViewClient],
})
export class PatientBasicViewModule {}
