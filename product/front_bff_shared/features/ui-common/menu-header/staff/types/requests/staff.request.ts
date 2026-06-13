export interface GetStaffRequest {
  department?: string;
  role?: "doctor" | "nurse" | "clerk";
}
