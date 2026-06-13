import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DischargeIntegrationController } from './discharge-integration.controller';
import { DischargeIntegrationService } from './discharge-integration.service';
import { DischargeIntegrationClient } from './discharge-integration.client';

@Module({
  imports: [HttpModule],
  controllers: [DischargeIntegrationController],
  providers: [DischargeIntegrationService, DischargeIntegrationClient],
})
export class DischargeIntegrationModule {}
