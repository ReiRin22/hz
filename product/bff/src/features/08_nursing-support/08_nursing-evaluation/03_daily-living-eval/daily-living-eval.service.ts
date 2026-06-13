import { Injectable } from '@nestjs/common';
import { DailyLivingEvalClient } from './daily-living-eval.client';

@Injectable()
export class DailyLivingEvalService {
  constructor(private readonly dailyLivingEvalClient: DailyLivingEvalClient) {}

  // TODO: ビジネスロジックを実装
}
