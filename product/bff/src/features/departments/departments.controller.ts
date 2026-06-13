import { Controller, Get, Inject } from "@nestjs/common";
import { DepartmentsService } from "./departments.service";
import type { GetDepartmentsResponse } from "./types/departments.api.response";

@Controller("departments")
export class DepartmentsController {
  constructor(@Inject(DepartmentsService) private readonly departmentsService: DepartmentsService) {}

  @Get()
  async getDepartments(): Promise<GetDepartmentsResponse> {
    return this.departmentsService.getDepartments();
  }
}
