import type { OrderType, OrderStatus } from "../../../../../../../front_bff_shared/features/orders/_shared/types/order.type";

export interface UpstreamSpecimenSubItem {
  id: string;
  testName: string;
  orderCode: string;
  specimenType: string;
  priority?: string;
}

/** 上流 API（オーダーシステム）から返却される生データ（BE は camelCase で返す） */
export interface UpstreamOrder {
  orderId: string;
  orderType: string;
  orderName: string;
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
  orderStatus?: string;
  specimenSubItems?: UpstreamSpecimenSubItem[] | null;
  deptInstructionStatus?: string;
}

/** 上流の帳票データ（BE は camelCase で返す） */
export interface UpstreamMedicalForm {
  formId: string;
  formType: string;
  formName: string;
  description: string;
  relatedOrderIds: string[];
  patientId: string;
  createdAt: string;
  createdBy: string;
  status: "READY" | "PRINTED";
  priority: "NORMAL" | "URGENT";
}

/** 上流のオーダー種別データ */
export interface UpstreamOrderType {
  id: string;
  name: string;
  route: string;
}

export function mapOrderStatus(upstreamStatus?: string): OrderStatus | undefined {
  const statusMap: Record<string, OrderStatus> = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    CANCELLED: "cancelled",
    ORDERED: "ordered",
    ACCEPTED: "accepted",
    IN_PROGRESS: "in-progress",
    COMPLETED: "completed",
  };
  return upstreamStatus ? statusMap[upstreamStatus] : undefined;
}

export function mapOrderType(upstreamType: string): OrderType {
  const typeMap: Record<string, OrderType> = {
    PRESCRIPTION: "prescription",
    INJECTION: "injection",
    PROCEDURE: "procedure",
    GUIDANCE: "guidance",
    LAB: "lab",
    PHYSIOLOGY: "physiology",
    ENDOSCOPY: "endoscopy",
    IMAGING: "imaging",
    PATHOLOGY: "pathology",
    MICROBIOLOGY: "microbiology",
    GENERAL: "general",
    REHABILITATION: "rehabilitation",
    TRANSFUSION: "transfusion",
    SURGERY: "surgery",
    DIALYSIS: "dialysis",
    NUTRITION: "nutrition",
    RESPIRATORY: "respiratory",
    BED: "bed",
    SURGERY_PROCEDURE: "surgeryProcedure",
    NEONATAL: "neonatal",
    PHYSICAL_THERAPY: "physicalTherapy",
  };
  return typeMap[upstreamType] ?? "general";
}
