import { Module } from "@nestjs/common";
import { ImagingHistoryController, ImagingSetsController } from "./imaging-orders.controller";
import { ImagingOrdersService } from "./imaging-orders.service";
import { ImagingOrdersClient } from "./imaging-orders.client";

@Module({
  controllers: [ImagingHistoryController, ImagingSetsController],
  providers: [ImagingOrdersService, ImagingOrdersClient],
})
export class ImagingOrdersModule {}
