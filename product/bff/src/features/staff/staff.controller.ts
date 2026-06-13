import { Controller, Get, Inject } from "@nestjs/common";
import { StaffService } from "./staff.service";
import type { GetStaffResponse } from "./types/staff.api.response";

@Controller("staff")
export class StaffController {
  constructor(@Inject(StaffService) private readonly staffService: StaffService) {}

  /** GET /bff/staff */
  @Get()
  async getStaff(): Promise<GetStaffResponse> {
    return this.staffService.getStaff();
  }
}
