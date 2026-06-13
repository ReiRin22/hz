import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BacteriaIntegrationController } from './bacteria-integration.controller';
import { BacteriaIntegrationService } from './bacteria-integration.service';
import { BacteriaIntegrationClient } from './bacteria-integration.client';

@Module({
  imports: [HttpModule],
  controllers: [BacteriaIntegrationController],
  providers: [BacteriaIntegrationService, BacteriaIntegrationClient],
})
export class BacteriaIntegrationModule {}
