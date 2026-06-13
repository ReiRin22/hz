import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NursingCareIntegrationController } from './nursing-care-integration.controller';
import { NursingCareIntegrationService } from './nursing-care-integration.service';
import { NursingCareIntegrationClient } from './nursing-care-integration.client';

@Module({
  imports: [HttpModule],
  controllers: [NursingCareIntegrationController],
  providers: [NursingCareIntegrationService, NursingCareIntegrationClient],
})
export class NursingCareIntegrationModule {}
