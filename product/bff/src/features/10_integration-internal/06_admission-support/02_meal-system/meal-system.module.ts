import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MealSystemController } from './meal-system.controller';
import { MealSystemService } from './meal-system.service';
import { MealSystemClient } from './meal-system.client';

@Module({
  imports: [HttpModule],
  controllers: [MealSystemController],
  providers: [MealSystemService, MealSystemClient],
})
export class MealSystemModule {}
