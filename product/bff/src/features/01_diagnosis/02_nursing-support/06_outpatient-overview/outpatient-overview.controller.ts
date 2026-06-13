import { Controller } from '@nestjs/common';
import { OutpatientOverviewService } from './outpatient-overview.service';

@Controller('outpatient-overview')
export class OutpatientOverviewController {
  constructor(private readonly outpatientOverviewService: OutpatientOverviewService) {}

  // TODO: エンドポイントを実装
}
