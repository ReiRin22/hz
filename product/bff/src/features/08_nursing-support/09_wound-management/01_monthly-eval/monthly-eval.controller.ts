import { Controller } from '@nestjs/common';
import { MonthlyEvalService } from './monthly-eval.service';

@Controller('monthly-eval')
export class MonthlyEvalController {
  constructor(private readonly monthlyEvalService: MonthlyEvalService) {}

  // TODO: エンドポイントを実装
}
