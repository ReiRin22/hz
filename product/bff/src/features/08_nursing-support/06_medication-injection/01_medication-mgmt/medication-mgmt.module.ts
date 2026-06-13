import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MedicationMgmtController } from './medication-mgmt.controller';
import { MedicationMgmtService } from './medication-mgmt.service';
import { MedicationMgmtClient } from './medication-mgmt.client';

@Module({
  imports: [HttpModule],
  controllers: [MedicationMgmtController],
  providers: [MedicationMgmtService, MedicationMgmtClient],
})
export class MedicationMgmtModule {}
