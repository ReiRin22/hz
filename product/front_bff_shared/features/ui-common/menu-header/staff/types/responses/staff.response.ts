export type StaffRole = "doctor" | "nurse" | "clerk";

export interface StaffMemberResponse {
  id: string;
  name: string;
  role: StaffRole;
  department: string;
}

export interface GetStaffResponse {
  staff: StaffMemberResponse[];
}
