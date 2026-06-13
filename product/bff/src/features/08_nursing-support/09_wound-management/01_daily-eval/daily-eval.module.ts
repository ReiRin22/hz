import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DailyEvalController } from './daily-eval.controller';
import { DailyEvalService } from './daily-eval.service';
import { DailyEvalClient } from './daily-eval.client';

@Module({
  imports: [HttpModule],
  controllers: [DailyEvalController],
  providers: [DailyEvalService, DailyEvalClient],
})
export class DailyEvalModule {}
