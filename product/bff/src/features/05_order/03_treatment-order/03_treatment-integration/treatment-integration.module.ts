import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TreatmentIntegrationController } from './treatment-integration.controller';
import { TreatmentIntegrationService } from './treatment-integration.service';
import { TreatmentIntegrationClient } from './treatment-integration.client';

@Module({
  imports: [HttpModule],
  controllers: [TreatmentIntegrationController],
  providers: [TreatmentIntegrationService, TreatmentIntegrationClient],
})
export class TreatmentIntegrationModule {}
