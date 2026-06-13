import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SummaryController } from './summary.controller';
import { SummaryService } from './summary.service';
import { SummaryClient } from './summary.client';

@Module({
  imports: [HttpModule],
  controllers: [SummaryController],
  providers: [SummaryService, SummaryClient],
})
export class SummaryModule {}
