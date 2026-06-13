import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RehabIntegrationController } from './rehab-integration.controller';
import { RehabIntegrationService } from './rehab-integration.service';
import { RehabIntegrationClient } from './rehab-integration.client';

@Module({
  imports: [HttpModule],
  controllers: [RehabIntegrationController],
  providers: [RehabIntegrationService, RehabIntegrationClient],
})
export class RehabIntegrationModule {}
