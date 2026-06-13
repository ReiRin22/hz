import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HospitalStatsController } from './hospital-stats.controller';
import { HospitalStatsService } from './hospital-stats.service';
import { HospitalStatsClient } from './hospital-stats.client';

@Module({
  imports: [HttpModule],
  controllers: [HospitalStatsController],
  providers: [HospitalStatsService, HospitalStatsClient],
})
export class HospitalStatsModule {}
