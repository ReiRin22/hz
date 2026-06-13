import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NursingPlanController } from './nursing-plan.controller';
import { NursingPlanService } from './nursing-plan.service';
import { NursingPlanClient } from './nursing-plan.client';

@Module({
  imports: [HttpModule],
  controllers: [NursingPlanController],
  providers: [NursingPlanService, NursingPlanClient],
})
export class NursingPlanModule {}
