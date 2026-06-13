import { Controller } from '@nestjs/common';
import { TestResultsViewService } from './test-results-view.service';

@Controller('test-results-view')
export class TestResultsViewController {
  constructor(private readonly testResultsViewService: TestResultsViewService) {}

  // TODO: エンドポイントを実装
}
