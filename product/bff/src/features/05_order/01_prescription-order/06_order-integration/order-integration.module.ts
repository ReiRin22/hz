import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrderIntegrationController } from './order-integration.controller';
import { OrderIntegrationService } from './order-integration.service';
import { OrderIntegrationClient } from './order-integration.client';

@Module({
  imports: [HttpModule],
  controllers: [OrderIntegrationController],
  providers: [OrderIntegrationService, OrderIntegrationClient],
})
export class OrderIntegrationModule {}
