import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HealthCheckupSystemController } from './health-checkup-system.controller';
import { HealthCheckupSystemService } from './health-checkup-system.service';
import { HealthCheckupSystemClient } from './health-checkup-system.client';

@Module({
  imports: [HttpModule],
  controllers: [HealthCheckupSystemController],
  providers: [HealthCheckupSystemService, HealthCheckupSystemClient],
})
export class HealthCheckupSystemModule {}
