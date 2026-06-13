import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MealStatsController } from './meal-stats.controller';
import { MealStatsService } from './meal-stats.service';
import { MealStatsClient } from './meal-stats.client';

@Module({
  imports: [HttpModule],
  controllers: [MealStatsController],
  providers: [MealStatsService, MealStatsClient],
})
export class MealStatsModule {}
