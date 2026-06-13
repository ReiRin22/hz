import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MealOutputController } from './meal-output.controller';
import { MealOutputService } from './meal-output.service';
import { MealOutputClient } from './meal-output.client';

@Module({
  imports: [HttpModule],
  controllers: [MealOutputController],
  providers: [MealOutputService, MealOutputClient],
})
export class MealOutputModule {}
