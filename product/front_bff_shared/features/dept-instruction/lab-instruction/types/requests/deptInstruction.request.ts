// BFF リクエスト型（FE/BFF 共有）

/** GET /deptInstructions クエリパラメータ */
export type GetDeptInstructionsRequest = {
  dept: string; // 'lab' | 'nursing' | etc.
  orderTypes?: string; // カンマ区切り例: 'specimen,physiology,pathology,bacteria'
  status?: string;
  date?: string; // ISO date string
  patientId?: string;
  ward?: string;
  doctor?: string;
  page?: number;
  pageSize?: number;
};

/** PATCH /deptInstructions/{orderId}/status リクエストボディ */
export type UpdateDeptInstructionStatusRequest = {
  orderId: string;
  newStatus: string;
  updatedBy: string;
  timestamp: string;
};

/** POST /deptInstructions/{orderId}/threePointCheck リクエストボディ */
export type PostThreePointCheckRequest = {
  orderId: string;
  patientConfirmed: boolean;
  orderConfirmed: boolean;
  allergyConfirmed: boolean;
  checkedBy: string;
  timestamp: string;
};

/** POST /deptInstructions/{orderId}/implementer リクエストボディ */
export type PostImplementerRequest = {
  orderId: string;
  implementer: string;
  witness?: string;
  location?: string;
  notes?: string;
  implementedAt: string;
  reason?: string;
};

/** POST /deptInstructions/{orderId}/billingLink リクエストボディ */
export type PostBillingLinkRequest = {
  orderId: string;
  triggerStatus: string;
  timestamp: string;
};
