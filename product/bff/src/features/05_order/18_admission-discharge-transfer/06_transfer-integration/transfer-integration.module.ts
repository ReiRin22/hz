import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TransferIntegrationController } from './transfer-integration.controller';
import { TransferIntegrationService } from './transfer-integration.service';
import { TransferIntegrationClient } from './transfer-integration.client';

@Module({
  imports: [HttpModule],
  controllers: [TransferIntegrationController],
  providers: [TransferIntegrationService, TransferIntegrationClient],
})
export class TransferIntegrationModule {}
