import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MonitoringSystemController } from './monitoring-system.controller';
import { MonitoringSystemService } from './monitoring-system.service';
import { MonitoringSystemClient } from './monitoring-system.client';

@Module({
  imports: [HttpModule],
  controllers: [MonitoringSystemController],
  providers: [MonitoringSystemService, MonitoringSystemClient],
})
export class MonitoringSystemModule {}
