import { Module } from "@nestjs/common";
import { SpecimenHistoryController, SpecimenSetsController, SpecimenItemsMasterController } from "./specimen-orders.controller";
import { SpecimenOrdersService } from "./specimen-orders.service";
import { SpecimenOrdersClient } from "./specimen-orders.client";

@Module({
  controllers: [SpecimenHistoryController, SpecimenSetsController, SpecimenItemsMasterController],
  providers: [SpecimenOrdersService, SpecimenOrdersClient],
})
export class SpecimenOrdersModule {}
