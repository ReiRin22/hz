import { Injectable } from '@nestjs/common';
import { TestResultsViewClient } from './test-results-view.client';

@Injectable()
export class TestResultsViewService {
  constructor(private readonly testResultsViewClient: TestResultsViewClient) {}

  // TODO: ビジネスロジックを実装
}
