import { Injectable, Inject } from "@nestjs/common";
import { StaffClient, type UpstreamStaffMember } from "./staff.client";
import type { StaffMemberResponse, GetStaffResponse } from "./types/staff.api.response";

const ROLE_MAP: Record<UpstreamStaffMember["staffRole"], StaffMemberResponse["role"]> = {
  DOCTOR: "doctor",
  NURSE: "nurse",
  CLERK: "clerk",
};

@Injectable()
export class StaffService {
  constructor(@Inject(StaffClient) private readonly staffClient: StaffClient) {}

  async getStaff(): Promise<GetStaffResponse> {
    const upstream = await this.staffClient.fetchStaff();
    return { staff: upstream.map((s) => this.transform(s)) };
  }

  private transform(upstream: UpstreamStaffMember): StaffMemberResponse {
    return {
      id: upstream.staffId,
      name: upstream.staffName,
      role: ROLE_MAP[upstream.staffRole],
      department: upstream.department,
    };
  }
}
