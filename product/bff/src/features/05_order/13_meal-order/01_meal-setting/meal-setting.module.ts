import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MealSettingController } from './meal-setting.controller';
import { MealSettingService } from './meal-setting.service';
import { MealSettingClient } from './meal-setting.client';

@Module({
  imports: [HttpModule],
  controllers: [MealSettingController],
  providers: [MealSettingService, MealSettingClient],
})
export class MealSettingModule {}
