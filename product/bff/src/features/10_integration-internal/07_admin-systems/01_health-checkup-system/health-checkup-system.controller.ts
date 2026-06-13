import { Controller } from '@nestjs/common';
import { HealthCheckupSystemService } from './health-checkup-system.service';

@Controller('health-checkup-system')
export class HealthCheckupSystemController {
  constructor(private readonly healthCheckupSystemService: HealthCheckupSystemService) {}

  // TODO: エンドポイントを実装
}
