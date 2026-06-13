import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GuidanceIntegrationController } from './guidance-integration.controller';
import { GuidanceIntegrationService } from './guidance-integration.service';
import { GuidanceIntegrationClient } from './guidance-integration.client';

@Module({
  imports: [HttpModule],
  controllers: [GuidanceIntegrationController],
  providers: [GuidanceIntegrationService, GuidanceIntegrationClient],
})
export class GuidanceIntegrationModule {}
