import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PatientHeaderController } from './patient-header.controller';
import { PatientHeaderService } from './patient-header.service';
import { PatientHeaderClient } from './patient-header.client';

@Module({
  imports: [HttpModule],
  controllers: [PatientHeaderController],
  providers: [PatientHeaderService, PatientHeaderClient],
})
export class PatientHeaderModule {}
