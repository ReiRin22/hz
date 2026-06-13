import { Injectable } from '@nestjs/common';
import { IncidentReportClient } from './incident-report.client';

@Injectable()
export class IncidentReportService {
  constructor(private readonly incidentReportClient: IncidentReportClient) {}

  // TODO: ビジネスロジックを実装
}
