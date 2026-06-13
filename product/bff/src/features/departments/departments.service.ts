import { Injectable, Inject } from "@nestjs/common";
import { DepartmentsClient } from "./departments.client";
import { UpstreamDepartment } from "./types/departments.type";
import {
  DepartmentResponse,
  GetDepartmentsResponse,
} from "./types/departments.api.response";

@Injectable()
export class DepartmentsService {
  constructor(@Inject(DepartmentsClient) private readonly departmentsClient: DepartmentsClient) {}

  async getDepartments(): Promise<GetDepartmentsResponse> {
    const upstream = await this.departmentsClient.fetchDepartments();
    return {
      departments: upstream.map((d) => this.transform(d)),
    };
  }

  private transform(upstream: UpstreamDepartment): DepartmentResponse {
    return {
      id: upstream.departmentId,
      name: upstream.departmentName,
    };
  }
}
