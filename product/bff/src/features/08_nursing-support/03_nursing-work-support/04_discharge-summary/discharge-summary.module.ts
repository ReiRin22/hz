import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DischargeSummaryController } from './discharge-summary.controller';
import { DischargeSummaryService } from './discharge-summary.service';
import { DischargeSummaryClient } from './discharge-summary.client';

@Module({
  imports: [HttpModule],
  controllers: [DischargeSummaryController],
  providers: [DischargeSummaryService, DischargeSummaryClient],
})
export class DischargeSummaryModule {}
