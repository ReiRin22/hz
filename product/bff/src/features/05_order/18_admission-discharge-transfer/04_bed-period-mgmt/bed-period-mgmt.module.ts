import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BedPeriodMgmtController } from './bed-period-mgmt.controller';
import { BedPeriodMgmtService } from './bed-period-mgmt.service';
import { BedPeriodMgmtClient } from './bed-period-mgmt.client';

@Module({
  imports: [HttpModule],
  controllers: [BedPeriodMgmtController],
  providers: [BedPeriodMgmtService, BedPeriodMgmtClient],
})
export class BedPeriodMgmtModule {}
