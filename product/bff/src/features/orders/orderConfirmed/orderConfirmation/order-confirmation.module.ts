import { Module } from "@nestjs/common";
import { OrderConfirmationController, OrderTypesController, DevController } from "./order-confirmation.controller";
import { OrderConfirmationService } from "./order-confirmation.service";
import { OrderConfirmationClient } from "./order-confirmation.client";

@Module({
  controllers: [OrderConfirmationController, OrderTypesController, DevController],
  providers: [OrderConfirmationService, OrderConfirmationClient],
})
export class OrderConfirmationModule {}
