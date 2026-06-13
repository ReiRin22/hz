import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ImagingIntegrationController } from './imaging-integration.controller';
import { ImagingIntegrationService } from './imaging-integration.service';
import { ImagingIntegrationClient } from './imaging-integration.client';

@Module({
  imports: [HttpModule],
  controllers: [ImagingIntegrationController],
  providers: [ImagingIntegrationService, ImagingIntegrationClient],
})
export class ImagingIntegrationModule {}
