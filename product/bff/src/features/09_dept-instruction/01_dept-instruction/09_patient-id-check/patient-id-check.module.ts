import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PatientIdCheckController } from './patient-id-check.controller';
import { PatientIdCheckService } from './patient-id-check.service';
import { PatientIdCheckClient } from './patient-id-check.client';

@Module({
  imports: [HttpModule],
  controllers: [PatientIdCheckController],
  providers: [PatientIdCheckService, PatientIdCheckClient],
})
export class PatientIdCheckModule {}
