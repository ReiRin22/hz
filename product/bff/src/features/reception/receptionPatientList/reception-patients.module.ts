import { Module } from "@nestjs/common";
import { ReceptionPatientsController } from "./reception-patients.controller";
import { ReceptionPatientsService } from "./reception-patients.service";
import { ReceptionPatientsClient } from "./reception-patients.client";

@Module({
  controllers: [ReceptionPatientsController],
  providers: [ReceptionPatientsService, ReceptionPatientsClient],
})
export class ReceptionPatientsModule {}
