import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { InjectionIntegrationController } from './injection-integration.controller';
import { InjectionIntegrationService } from './injection-integration.service';
import { InjectionIntegrationClient } from './injection-integration.client';

@Module({
  imports: [HttpModule],
  controllers: [InjectionIntegrationController],
  providers: [InjectionIntegrationService, InjectionIntegrationClient],
})
export class InjectionIntegrationModule {}
