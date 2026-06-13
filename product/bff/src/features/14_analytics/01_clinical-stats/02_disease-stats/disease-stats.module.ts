import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DiseaseStatsController } from './disease-stats.controller';
import { DiseaseStatsService } from './disease-stats.service';
import { DiseaseStatsClient } from './disease-stats.client';

@Module({
  imports: [HttpModule],
  controllers: [DiseaseStatsController],
  providers: [DiseaseStatsService, DiseaseStatsClient],
})
export class DiseaseStatsModule {}
