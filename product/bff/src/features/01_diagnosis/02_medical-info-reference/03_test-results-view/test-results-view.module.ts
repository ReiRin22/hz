import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TestResultsViewController } from './test-results-view.controller';
import { TestResultsViewService } from './test-results-view.service';
import { TestResultsViewClient } from './test-results-view.client';

@Module({
  imports: [HttpModule],
  controllers: [TestResultsViewController],
  providers: [TestResultsViewService, TestResultsViewClient],
})
export class TestResultsViewModule {}
