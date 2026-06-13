import type { OrderType, OrderStatus } from "../../../../_shared/types/order.type";

export interface SpecimenSubItemResponse {
  id: string;
  testName: string;
  orderCode: string;
  specimenType: string;
  priority?: string;
}

export interface OrderResponse {
  id: string;
  type: OrderType;
  name: string;
  dosage?: string;
  frequency?: string;
  duration?: string;
  instructions?: string;
  priority?: string;
  amount?: string;
  scheduledAt?: string;
  confirmedAt?: string;
  confirmedBy?: string;
  implementedAt?: string;
  implementedBy?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  status?: OrderStatus;
  specimenSubItems?: SpecimenSubItemResponse[];
  /** DEP002で更新された部門指示受けステータス（received / accepted / collected / implemented 等） */
  deptInstructionStatus?: string;
}

export interface PatientResponse {
  id: string;
  name: string;
  allergies: string[];
  conditions: {
    pregnancy: boolean;
    renalImpairment: boolean;
    hepaticImpairment: boolean;
    elderly: boolean;
  };
  renalFunction: {
    ccr: number;
  };
}

export interface GetOrdersResponse {
  orders: OrderResponse[];
}

export interface ConfirmOrdersResponse {
  confirmedOrders: OrderResponse[];
}

export interface CancelOrderResponse {
  order: OrderResponse;
}

export interface UpdateOrderResponse {
  order: OrderResponse;
}

export type MedicalFormType =
  | "PRESCRIPTION"
  | "LAB_REQUEST"
  | "IMAGING_REQUEST"
  | "PROCEDURE_CONSENT"
  | "NURSING_INSTRUCTION"
  | "REFERRAL"
  | "DISCHARGE_SUMMARY";

export interface MedicalFormResponse {
  id: string;
  type: MedicalFormType;
  name: string;
  description: string;
  relatedOrderIds: string[];
  patientId: string;
  createdAt: string;
  createdBy: string;
  status: "READY" | "PRINTED";
  priority: "NORMAL" | "URGENT";
}

export interface GetMedicalFormsResponse {
  forms: MedicalFormResponse[];
}

export interface OutputMedicalFormsResponse {
  outputForms: Array<{ formId: string; pdfUrl: string }>;
}

export interface RevokeOrderResponse {
  order: OrderResponse;
}

export interface OrderTypeItem {
  id: string;
  name: string;
  route: string;
}

export interface GetOrderTypesResponse {
  orderTypes: OrderTypeItem[];
}
