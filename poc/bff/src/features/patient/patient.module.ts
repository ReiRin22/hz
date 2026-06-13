import { Module } from '@nestjs/common';
import { PatientController } from '@/features/patient/patient.controller';
import { PatientService } from '@/features/patient/patient.service';
import { PatientClient } from '@/features/patient/patient.client';

@Module({
  controllers: [PatientController],
  providers: [
    PatientService,
    PatientClient
  ],

})
export class PatientModule {}