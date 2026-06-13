import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProxyOrderController } from './proxy-order.controller';
import { ProxyOrderService } from './proxy-order.service';
import { ProxyOrderClient } from './proxy-order.client';

@Module({
  imports: [HttpModule],
  controllers: [ProxyOrderController],
  providers: [ProxyOrderService, ProxyOrderClient],
})
export class ProxyOrderModule {}
