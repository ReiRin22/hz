import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrderOutputController } from './order-output.controller';
import { OrderOutputService } from './order-output.service';
import { OrderOutputClient } from './order-output.client';

@Module({
  imports: [HttpModule],
  controllers: [OrderOutputController],
  providers: [OrderOutputService, OrderOutputClient],
})
export class OrderOutputModule {}
