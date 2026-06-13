import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EndoscopyIntegrationController } from './endoscopy-integration.controller';
import { EndoscopyIntegrationService } from './endoscopy-integration.service';
import { EndoscopyIntegrationClient } from './endoscopy-integration.client';

@Module({
  imports: [HttpModule],
  controllers: [EndoscopyIntegrationController],
  providers: [EndoscopyIntegrationService, EndoscopyIntegrationClient],
})
export class EndoscopyIntegrationModule {}
