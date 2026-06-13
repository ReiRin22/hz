// BFF レスポンス型（FE/BFF 共有）

export type DeptInstructionOrderResponse = {
  id: string;
  status: string;
  patientId: string;
  patientName: string;
  patientKana: string;
  gender: string;
  birthDate: string;
  age: number;
  orderType: string;
  content: string;
  hasAllergies: boolean;
  location: string;
  department: string;
  attendingDoctor?: string;
  ward?: string;
  roomNumber?: string;
  procedureType?: string;
  receivedAt: string;
  acceptedAt?: string;
  implementedAt?: string;
  acceptedBy?: string;
  implementedBy?: string;
  implementationNotes?: string;
  scheduledTime?: string;
  materialRecorded?: boolean;
  labTestLocation?: string;
  imageTestType?: string;
  physiologicalTestType?: string;
  examinationType?: string;
  statusHistory?: DeptInstructionStatusHistoryResponse[];
};

export type DeptInstructionStatusHistoryResponse = {
  status: string;
  timestamp: string;
  updatedBy: string;
};

/** GET /deptInstructions レスポンス */
export type GetDeptInstructionsResponse = {
  orders: DeptInstructionOrderResponse[];
  total: number;
  page: number;
  pageSize: number;
};

/** PATCH /deptInstructions/{orderId}/status レスポンス */
export type UpdateDeptInstructionStatusResponse = {
  orderId: string;
  newStatus: string;
  updatedAt: string;
};

/** POST /deptInstructions/{orderId}/threePointCheck レスポンス */
export type PostThreePointCheckResponse = {
  orderId: string;
  checkedAt: string;
};

/** POST /deptInstructions/{orderId}/implementer レスポンス */
export type PostImplementerResponse = {
  orderId: string;
  implementedAt: string;
  newStatus: string;
};

/** POST /deptInstructions/{orderId}/billingLink レスポンス */
export type PostBillingLinkResponse = {
  orderId: string;
  billingLinkedAt: string;
  success: boolean;
};
