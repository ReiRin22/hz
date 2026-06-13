import { Injectable } from '@nestjs/common';
import { OutpatientOverviewClient } from './outpatient-overview.client';

@Injectable()
export class OutpatientOverviewService {
  constructor(private readonly outpatientOverviewClient: OutpatientOverviewClient) {}

  // TODO: ビジネスロジックを実装
}
