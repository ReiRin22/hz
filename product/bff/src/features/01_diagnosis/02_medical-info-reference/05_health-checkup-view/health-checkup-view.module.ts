import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HealthCheckupViewController } from './health-checkup-view.controller';
import { HealthCheckupViewService } from './health-checkup-view.service';
import { HealthCheckupViewClient } from './health-checkup-view.client';

@Module({
  imports: [HttpModule],
  controllers: [HealthCheckupViewController],
  providers: [HealthCheckupViewService, HealthCheckupViewClient],
})
export class HealthCheckupViewModule {}
