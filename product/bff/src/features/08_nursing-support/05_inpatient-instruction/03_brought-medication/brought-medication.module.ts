import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BroughtMedicationController } from './brought-medication.controller';
import { BroughtMedicationService } from './brought-medication.service';
import { BroughtMedicationClient } from './brought-medication.client';

@Module({
  imports: [HttpModule],
  controllers: [BroughtMedicationController],
  providers: [BroughtMedicationService, BroughtMedicationClient],
})
export class BroughtMedicationModule {}
