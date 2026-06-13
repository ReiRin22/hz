import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WorksheetIssueController } from './worksheet-issue.controller';
import { WorksheetIssueService } from './worksheet-issue.service';
import { WorksheetIssueClient } from './worksheet-issue.client';

@Module({
  imports: [HttpModule],
  controllers: [WorksheetIssueController],
  providers: [WorksheetIssueService, WorksheetIssueClient],
})
export class WorksheetIssueModule {}
