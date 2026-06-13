import { Controller } from '@nestjs/common';
import { MonitoringSystemService } from './monitoring-system.service';

@Controller('monitoring-system')
export class MonitoringSystemController {
  constructor(private readonly monitoringSystemService: MonitoringSystemService) {}

  // TODO: エンドポイントを実装
}
