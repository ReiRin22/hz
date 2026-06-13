import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MedicalCategoryStatsController } from './medical-category-stats.controller';
import { MedicalCategoryStatsService } from './medical-category-stats.service';
import { MedicalCategoryStatsClient } from './medical-category-stats.client';

@Module({
  imports: [HttpModule],
  controllers: [MedicalCategoryStatsController],
  providers: [MedicalCategoryStatsService, MedicalCategoryStatsClient],
})
export class MedicalCategoryStatsModule {}
