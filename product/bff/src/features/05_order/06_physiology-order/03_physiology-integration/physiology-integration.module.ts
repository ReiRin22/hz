import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PhysiologyIntegrationController } from './physiology-integration.controller';
import { PhysiologyIntegrationService } from './physiology-integration.service';
import { PhysiologyIntegrationClient } from './physiology-integration.client';

@Module({
  imports: [HttpModule],
  controllers: [PhysiologyIntegrationController],
  providers: [PhysiologyIntegrationService, PhysiologyIntegrationClient],
})
export class PhysiologyIntegrationModule {}
