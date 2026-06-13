import { Module } from "@nestjs/common";
import { PatientsController } from "./patients.controller";
import { PatientsService } from "./patients.service";
import { PatientsClient } from "./patients.client";

@Module({
  controllers: [PatientsController],
  providers: [PatientsService, PatientsClient],
  exports: [PatientsService],
})
export class PatientsModule {}
