import { Injectable } from '@nestjs/common';
import { HealthCheckupViewClient } from './health-checkup-view.client';

@Injectable()
export class HealthCheckupViewService {
  constructor(private readonly healthCheckupViewClient: HealthCheckupViewClient) {}

  // TODO: ビジネスロジックを実装
}
