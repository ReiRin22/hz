import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrderSetRegistrationController } from './order-set-registration.controller';
import { OrderSetRegistrationService } from './order-set-registration.service';
import { OrderSetRegistrationClient } from './order-set-registration.client';

@Module({
  imports: [HttpModule],
  controllers: [OrderSetRegistrationController],
  providers: [OrderSetRegistrationService, OrderSetRegistrationClient],
})
export class OrderSetRegistrationModule {}
