import { Module } from "@nestjs/common";
import { OrderSetsController } from "./order-sets.controller";
import { OrderSetsService } from "./order-sets.service";
import { OrderSetsClient } from "./order-sets.client";

@Module({
  controllers: [OrderSetsController],
  providers: [OrderSetsService, OrderSetsClient],
})
export class OrderSetsModule {}
