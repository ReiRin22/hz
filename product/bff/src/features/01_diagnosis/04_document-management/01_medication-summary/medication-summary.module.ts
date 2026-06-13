import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MedicationSummaryController } from './medication-summary.controller';
import { MedicationSummaryService } from './medication-summary.service';
import { MedicationSummaryClient } from './medication-summary.client';

@Module({
  imports: [HttpModule],
  controllers: [MedicationSummaryController],
  providers: [MedicationSummaryService, MedicationSummaryClient],
})
export class MedicationSummaryModule {}
