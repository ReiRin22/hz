import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SpecimenIntegrationController } from './specimen-integration.controller';
import { SpecimenIntegrationService } from './specimen-integration.service';
import { SpecimenIntegrationClient } from './specimen-integration.client';

@Module({
  imports: [HttpModule],
  controllers: [SpecimenIntegrationController],
  providers: [SpecimenIntegrationService, SpecimenIntegrationClient],
})
export class SpecimenIntegrationModule {}
