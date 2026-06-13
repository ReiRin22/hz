import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MedicalAccountingController } from './medical-accounting.controller';
import { MedicalAccountingService } from './medical-accounting.service';
import { MedicalAccountingClient } from './medical-accounting.client';

@Module({
  imports: [HttpModule],
  controllers: [MedicalAccountingController],
  providers: [MedicalAccountingService, MedicalAccountingClient],
})
export class MedicalAccountingModule {}
