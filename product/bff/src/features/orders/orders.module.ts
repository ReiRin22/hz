import { Module } from "@nestjs/common";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { OrdersClient } from "./orders.client";

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, OrdersClient],
  exports: [OrdersService],
})
export class OrdersModule {}
