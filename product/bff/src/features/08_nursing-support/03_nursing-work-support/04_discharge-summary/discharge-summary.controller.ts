import { Controller } from '@nestjs/common';
import { DischargeSummaryService } from './discharge-summary.service';

@Controller('discharge-summary')
export class DischargeSummaryController {
  constructor(private readonly dischargeSummaryService: DischargeSummaryService) {}

  // TODO: エンドポイントを実装
}
