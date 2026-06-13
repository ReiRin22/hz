import { Controller } from '@nestjs/common';
import { AccessLogService } from './access-log.service';

@Controller('access-log')
export class AccessLogController {
  constructor(private readonly accessLogService: AccessLogService) {}

  // TODO: エンドポイントを実装
}
