import { Controller } from '@nestjs/common';
import { WorksheetIssueService } from './worksheet-issue.service';

@Controller('worksheet-issue')
export class WorksheetIssueController {
  constructor(private readonly worksheetIssueService: WorksheetIssueService) {}

  // TODO: エンドポイントを実装
}
