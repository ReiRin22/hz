import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MealChangeController } from './meal-change.controller';
import { MealChangeService } from './meal-change.service';
import { MealChangeClient } from './meal-change.client';

@Module({
  imports: [HttpModule],
  controllers: [MealChangeController],
  providers: [MealChangeService, MealChangeClient],
})
export class MealChangeModule {}
