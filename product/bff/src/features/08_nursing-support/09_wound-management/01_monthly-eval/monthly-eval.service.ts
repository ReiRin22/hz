import { Injectable } from '@nestjs/common';
import { MonthlyEvalClient } from './monthly-eval.client';

@Injectable()
export class MonthlyEvalService {
  constructor(private readonly monthlyEvalClient: MonthlyEvalClient) {}

  // TODO: ビジネスロジックを実装
}
