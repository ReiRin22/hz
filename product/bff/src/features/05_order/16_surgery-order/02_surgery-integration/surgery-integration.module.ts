import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SurgeryIntegrationController } from './surgery-integration.controller';
import { SurgeryIntegrationService } from './surgery-integration.service';
import { SurgeryIntegrationClient } from './surgery-integration.client';

@Module({
  imports: [HttpModule],
  controllers: [SurgeryIntegrationController],
  providers: [SurgeryIntegrationService, SurgeryIntegrationClient],
})
export class SurgeryIntegrationModule {}
