import { Module } from "@nestjs/common";
import { DepartmentsController } from "./departments.controller";
import { DepartmentsService } from "./departments.service";
import { DepartmentsClient } from "./departments.client";

@Module({
  controllers: [DepartmentsController],
  providers: [DepartmentsService, DepartmentsClient],
})
export class DepartmentsModule {}
