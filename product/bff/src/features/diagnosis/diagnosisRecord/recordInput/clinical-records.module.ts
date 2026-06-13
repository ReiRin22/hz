import { Module } from "@nestjs/common";
import { ClinicalRecordsController } from "./clinical-records.controller";
import { ClinicalRecordsService } from "./clinical-records.service";
import { ClinicalRecordsClient } from "./clinical-records.client";

@Module({
  controllers: [ClinicalRecordsController],
  providers: [ClinicalRecordsService, ClinicalRecordsClient],
})
export class ClinicalRecordsModule {}
