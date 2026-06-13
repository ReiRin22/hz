import { Controller } from '@nestjs/common';
import { AuditLogService } from './auditLog.service';

@Controller('log-mgmt')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  // TODO: エンドポイントを実装
}
