import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuditLogController } from './auditLog.controller';
import { AuditLogService } from './auditLog.service';
import { AuditLogClient } from './auditLog.client';

@Module({
  imports: [HttpModule],
  controllers: [AuditLogController],
  providers: [AuditLogService, AuditLogClient],
})
export class AuditLogModule {}
