import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DailyLivingEvalController } from './daily-living-eval.controller';
import { DailyLivingEvalService } from './daily-living-eval.service';
import { DailyLivingEvalClient } from './daily-living-eval.client';

@Module({
  imports: [HttpModule],
  controllers: [DailyLivingEvalController],
  providers: [DailyLivingEvalService, DailyLivingEvalClient],
})
export class DailyLivingEvalModule {}
