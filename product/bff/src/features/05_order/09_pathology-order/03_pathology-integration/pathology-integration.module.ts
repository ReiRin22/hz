import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PathologyIntegrationController } from './pathology-integration.controller';
import { PathologyIntegrationService } from './pathology-integration.service';
import { PathologyIntegrationClient } from './pathology-integration.client';

@Module({
  imports: [HttpModule],
  controllers: [PathologyIntegrationController],
  providers: [PathologyIntegrationService, PathologyIntegrationClient],
})
export class PathologyIntegrationModule {}
