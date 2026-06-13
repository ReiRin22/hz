import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GeneralIntegrationController } from './general-integration.controller';
import { GeneralIntegrationService } from './general-integration.service';
import { GeneralIntegrationClient } from './general-integration.client';

@Module({
  imports: [HttpModule],
  controllers: [GeneralIntegrationController],
  providers: [GeneralIntegrationService, GeneralIntegrationClient],
})
export class GeneralIntegrationModule {}
