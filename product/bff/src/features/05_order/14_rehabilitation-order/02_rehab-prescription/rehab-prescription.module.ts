import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RehabPrescriptionController } from './rehab-prescription.controller';
import { RehabPrescriptionService } from './rehab-prescription.service';
import { RehabPrescriptionClient } from './rehab-prescription.client';

@Module({
  imports: [HttpModule],
  controllers: [RehabPrescriptionController],
  providers: [RehabPrescriptionService, RehabPrescriptionClient],
})
export class RehabPrescriptionModule {}
