import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MedicationHistoryController } from './medication-history.controller';
import { MedicationHistoryService } from './medication-history.service';
import { MedicationHistoryClient } from './medication-history.client';

@Module({
  imports: [HttpModule],
  controllers: [MedicationHistoryController],
  providers: [MedicationHistoryService, MedicationHistoryClient],
})
export class MedicationHistoryModule {}
