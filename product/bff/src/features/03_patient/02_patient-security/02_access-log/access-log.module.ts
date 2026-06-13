import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AccessLogController } from './access-log.controller';
import { AccessLogService } from './access-log.service';
import { AccessLogClient } from './access-log.client';

@Module({
  imports: [HttpModule],
  controllers: [AccessLogController],
  providers: [AccessLogService, AccessLogClient],
})
export class AccessLogModule {}
