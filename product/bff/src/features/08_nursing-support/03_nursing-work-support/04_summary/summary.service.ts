import { Injectable } from '@nestjs/common';
import { SummaryClient } from './summary.client';

@Injectable()
export class SummaryService {
  constructor(private readonly summaryClient: SummaryClient) {}

  // TODO: ビジネスロジックを実装
}
