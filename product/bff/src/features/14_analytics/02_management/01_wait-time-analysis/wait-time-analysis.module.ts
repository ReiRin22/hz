import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WaitTimeAnalysisController } from './wait-time-analysis.controller';
import { WaitTimeAnalysisService } from './wait-time-analysis.service';
import { WaitTimeAnalysisClient } from './wait-time-analysis.client';

@Module({
  imports: [HttpModule],
  controllers: [WaitTimeAnalysisController],
  providers: [WaitTimeAnalysisService, WaitTimeAnalysisClient],
})
export class WaitTimeAnalysisModule {}
