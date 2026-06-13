import { Injectable } from '@nestjs/common';
import { AuditLogClient } from './auditLog.client';

@Injectable()
export class AuditLogService {
  constructor(private readonly auditLogClient: AuditLogClient) {}

  // TODO: ビジネスロジックを実装
}
