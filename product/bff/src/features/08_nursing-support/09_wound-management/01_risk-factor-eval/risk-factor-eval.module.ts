import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RiskFactorEvalController } from './risk-factor-eval.controller';
import { RiskFactorEvalService } from './risk-factor-eval.service';
import { RiskFactorEvalClient } from './risk-factor-eval.client';

@Module({
  imports: [HttpModule],
  controllers: [RiskFactorEvalController],
  providers: [RiskFactorEvalService, RiskFactorEvalClient],
})
export class RiskFactorEvalModule {}
