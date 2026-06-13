import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PressureSorePlanController } from './pressure-sore-plan.controller';
import { PressureSorePlanService } from './pressure-sore-plan.service';
import { PressureSorePlanClient } from './pressure-sore-plan.client';

@Module({
  imports: [HttpModule],
  controllers: [PressureSorePlanController],
  providers: [PressureSorePlanService, PressureSorePlanClient],
})
export class PressureSorePlanModule {}
