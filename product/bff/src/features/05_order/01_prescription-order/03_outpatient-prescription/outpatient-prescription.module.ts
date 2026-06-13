import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OutpatientPrescriptionController } from './outpatient-prescription.controller';
import { OutpatientPrescriptionService } from './outpatient-prescription.service';
import { OutpatientPrescriptionClient } from './outpatient-prescription.client';

@Module({
  imports: [HttpModule],
  controllers: [OutpatientPrescriptionController],
  providers: [OutpatientPrescriptionService, OutpatientPrescriptionClient],
})
export class OutpatientPrescriptionModule {}
