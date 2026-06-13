import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RehabPlanController } from './rehab-plan.controller';
import { RehabPlanService } from './rehab-plan.service';
import { RehabPlanClient } from './rehab-plan.client';

@Module({
  imports: [HttpModule],
  controllers: [RehabPlanController],
  providers: [RehabPlanService, RehabPlanClient],
})
export class RehabPlanModule {}
