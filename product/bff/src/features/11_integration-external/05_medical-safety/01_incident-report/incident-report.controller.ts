import { Controller } from '@nestjs/common';
import { IncidentReportService } from './incident-report.service';

@Controller('incident-report')
export class IncidentReportController {
  constructor(private readonly incidentReportService: IncidentReportService) {}

  // TODO: エンドポイントを実装
}
