import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DialysisIntegrationController } from './dialysis-integration.controller';
import { DialysisIntegrationService } from './dialysis-integration.service';
import { DialysisIntegrationClient } from './dialysis-integration.client';

@Module({
  imports: [HttpModule],
  controllers: [DialysisIntegrationController],
  providers: [DialysisIntegrationService, DialysisIntegrationClient],
})
export class DialysisIntegrationModule {}
