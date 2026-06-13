import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MealIntegrationController } from './meal-integration.controller';
import { MealIntegrationService } from './meal-integration.service';
import { MealIntegrationClient } from './meal-integration.client';

@Module({
  imports: [HttpModule],
  controllers: [MealIntegrationController],
  providers: [MealIntegrationService, MealIntegrationClient],
})
export class MealIntegrationModule {}
