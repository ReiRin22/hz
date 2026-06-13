import { Injectable } from '@nestjs/common';
import { MonitoringSystemClient } from './monitoring-system.client';

@Injectable()
export class MonitoringSystemService {
  constructor(private readonly monitoringSystemClient: MonitoringSystemClient) {}

  // TODO: ビジネスロジックを実装
}
