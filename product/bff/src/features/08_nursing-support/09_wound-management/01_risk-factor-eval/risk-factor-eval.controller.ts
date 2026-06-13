import { Controller } from '@nestjs/common';
import { RiskFactorEvalService } from './risk-factor-eval.service';

@Controller('risk-factor-eval')
export class RiskFactorEvalController {
  constructor(private readonly riskFactorEvalService: RiskFactorEvalService) {}

  // TODO: エンドポイントを実装
}
