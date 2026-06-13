import { Injectable } from '@nestjs/common';
import { RiskFactorEvalClient } from './risk-factor-eval.client';

@Injectable()
export class RiskFactorEvalService {
  constructor(private readonly riskFactorEvalClient: RiskFactorEvalClient) {}

  // TODO: ビジネスロジックを実装
}
