import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrderConfirmController } from './order-confirm.controller';
import { OrderConfirmService } from './order-confirm.service';
import { OrderConfirmClient } from './order-confirm.client';

@Module({
  imports: [HttpModule],
  controllers: [OrderConfirmController],
  providers: [OrderConfirmService, OrderConfirmClient],
})
export class OrderConfirmModule {}
