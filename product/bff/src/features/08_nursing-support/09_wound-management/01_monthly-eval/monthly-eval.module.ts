import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MonthlyEvalController } from './monthly-eval.controller';
import { MonthlyEvalService } from './monthly-eval.service';
import { MonthlyEvalClient } from './monthly-eval.client';

@Module({
  imports: [HttpModule],
  controllers: [MonthlyEvalController],
  providers: [MonthlyEvalService, MonthlyEvalClient],
})
export class MonthlyEvalModule {}
