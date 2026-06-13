import { Injectable } from '@nestjs/common';
import { HealthCheckupSystemClient } from './health-checkup-system.client';

@Injectable()
export class HealthCheckupSystemService {
  constructor(private readonly healthCheckupSystemClient: HealthCheckupSystemClient) {}

  // TODO: ビジネスロジックを実装
}
