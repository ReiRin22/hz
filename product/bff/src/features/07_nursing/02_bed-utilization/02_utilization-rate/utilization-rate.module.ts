import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UtilizationRateController } from './utilization-rate.controller';
import { UtilizationRateService } from './utilization-rate.service';
import { UtilizationRateClient } from './utilization-rate.client';

@Module({
  imports: [HttpModule],
  controllers: [UtilizationRateController],
  providers: [UtilizationRateService, UtilizationRateClient],
})
export class UtilizationRateModule {}
