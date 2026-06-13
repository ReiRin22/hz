import { Injectable } from '@nestjs/common';
import { DailyEvalClient } from './daily-eval.client';

@Injectable()
export class DailyEvalService {
  constructor(private readonly dailyEvalClient: DailyEvalClient) {}

  // TODO: ビジネスロジックを実装
}
