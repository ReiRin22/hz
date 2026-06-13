import { Injectable } from '@nestjs/common';
import { DischargeSummaryClient } from './discharge-summary.client';

@Injectable()
export class DischargeSummaryService {
  constructor(private readonly dischargeSummaryClient: DischargeSummaryClient) {}

  // TODO: ビジネスロジックを実装
}
