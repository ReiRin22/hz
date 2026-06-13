/** 上流 API（スタッフマスター）から返却される生データ */
export interface UpstreamStaffMember {
  staffId: string;
  staffName: string;
  staffRole: "DOCTOR" | "NURSE" | "CLERK";
  department: string;
}
