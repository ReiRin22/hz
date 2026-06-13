import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { InpatientPrescriptionController } from './inpatient-prescription.controller';
import { InpatientPrescriptionService } from './inpatient-prescription.service';
import { InpatientPrescriptionClient } from './inpatient-prescription.client';

@Module({
  imports: [HttpModule],
  controllers: [InpatientPrescriptionController],
  providers: [InpatientPrescriptionService, InpatientPrescriptionClient],
})
export class InpatientPrescriptionModule {}
