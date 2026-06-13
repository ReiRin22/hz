import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CompositeIntegrationController } from './composite-integration.controller';
import { CompositeIntegrationService } from './composite-integration.service';
import { CompositeIntegrationClient } from './composite-integration.client';

@Module({
  imports: [HttpModule],
  controllers: [CompositeIntegrationController],
  providers: [CompositeIntegrationService, CompositeIntegrationClient],
})
export class CompositeIntegrationModule {}
