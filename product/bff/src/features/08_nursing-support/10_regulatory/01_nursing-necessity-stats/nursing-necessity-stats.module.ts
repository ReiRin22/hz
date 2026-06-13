import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NursingNecessityStatsController } from './nursing-necessity-stats.controller';
import { NursingNecessityStatsService } from './nursing-necessity-stats.service';
import { NursingNecessityStatsClient } from './nursing-necessity-stats.client';

@Module({
  imports: [HttpModule],
  controllers: [NursingNecessityStatsController],
  providers: [NursingNecessityStatsService, NursingNecessityStatsClient],
})
export class NursingNecessityStatsModule {}
