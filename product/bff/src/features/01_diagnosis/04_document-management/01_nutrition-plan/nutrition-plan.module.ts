import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NutritionPlanController } from './nutrition-plan.controller';
import { NutritionPlanService } from './nutrition-plan.service';
import { NutritionPlanClient } from './nutrition-plan.client';

@Module({
  imports: [HttpModule],
  controllers: [NutritionPlanController],
  providers: [NutritionPlanService, NutritionPlanClient],
})
export class NutritionPlanModule {}
