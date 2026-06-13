import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NursingDiagnosisController } from './nursing-diagnosis.controller';
import { NursingDiagnosisService } from './nursing-diagnosis.service';
import { NursingDiagnosisClient } from './nursing-diagnosis.client';

@Module({
  imports: [HttpModule],
  controllers: [NursingDiagnosisController],
  providers: [NursingDiagnosisService, NursingDiagnosisClient],
})
export class NursingDiagnosisModule {}
