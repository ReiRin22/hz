/** 上流 API（指示受け管理システム）から返却される生データ（BE は camelCase で返す） */

export interface UpstreamDeptInstructionStatusHistory {
  status: string;
  timestamp: string;
  updatedBy: string;
}

export interface UpstreamDeptInstructionOrder {
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
  statusHistory?: UpstreamDeptInstructionStatusHistory[];
}

export interface UpstreamGetDeptInstructionsResponse {
  orders: UpstreamDeptInstructionOrder[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UpstreamUpdateStatusResponse {
  orderId: string;
  newStatus: string;
  updatedAt: string;
}

export interface UpstreamThreePointCheckResponse {
  orderId: string;
  checkedAt: string;
}

export interface UpstreamImplementerResponse {
  orderId: string;
  implementedAt: string;
  newStatus: string;
}

export interface UpstreamBillingLinkResponse {
  orderId: string;
  billingLinkedAt: string;
  success: boolean;
}
