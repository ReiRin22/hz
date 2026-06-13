import { Injectable } from '@nestjs/common';
import { WorksheetIssueClient } from './worksheet-issue.client';

@Injectable()
export class WorksheetIssueService {
  constructor(private readonly worksheetIssueClient: WorksheetIssueClient) {}

  // TODO: ビジネスロジックを実装
}
