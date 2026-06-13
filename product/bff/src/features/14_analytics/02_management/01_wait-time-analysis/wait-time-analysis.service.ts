import { Injectable } from '@nestjs/common';
import { WaitTimeAnalysisClient } from './wait-time-analysis.client';

@Injectable()
export class WaitTimeAnalysisService {
  constructor(private readonly waitTimeAnalysisClient: WaitTimeAnalysisClient) {}

  // TODO: ビジネスロジックを実装
}
