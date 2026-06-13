import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { IncidentReportController } from './incident-report.controller';
import { IncidentReportService } from './incident-report.service';
import { IncidentReportClient } from './incident-report.client';

@Module({
  imports: [HttpModule],
  controllers: [IncidentReportController],
  providers: [IncidentReportService, IncidentReportClient],
})
export class IncidentReportModule {}
