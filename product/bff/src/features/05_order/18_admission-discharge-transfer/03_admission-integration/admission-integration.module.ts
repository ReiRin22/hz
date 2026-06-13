import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AdmissionIntegrationController } from './admission-integration.controller';
import { AdmissionIntegrationService } from './admission-integration.service';
import { AdmissionIntegrationClient } from './admission-integration.client';

@Module({
  imports: [HttpModule],
  controllers: [AdmissionIntegrationController],
  providers: [AdmissionIntegrationService, AdmissionIntegrationClient],
})
export class AdmissionIntegrationModule {}
