import { Controller } from '@nestjs/common';
import { HealthCheckupViewService } from './health-checkup-view.service';

@Controller('health-checkup-view')
export class HealthCheckupViewController {
  constructor(private readonly healthCheckupViewService: HealthCheckupViewService) {}

  // TODO: エンドポイントを実装
}
