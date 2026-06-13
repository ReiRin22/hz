import { Module } from "@nestjs/common";
import { StaffController } from "./staff.controller";
import { StaffService } from "./staff.service";
import { StaffClient } from "./staff.client";

@Module({
  controllers: [StaffController],
  providers: [StaffService, StaffClient],
})
export class StaffModule {}
