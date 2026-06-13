import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TransfusionIntegrationController } from './transfusion-integration.controller';
import { TransfusionIntegrationService } from './transfusion-integration.service';
import { TransfusionIntegrationClient } from './transfusion-integration.client';

@Module({
  imports: [HttpModule],
  controllers: [TransfusionIntegrationController],
  providers: [TransfusionIntegrationService, TransfusionIntegrationClient],
})
export class TransfusionIntegrationModule {}
