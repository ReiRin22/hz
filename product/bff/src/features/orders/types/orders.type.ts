import type { OrderType, OrderStatus } from "../../../front_bff_shared/features/orders/_shared/types/order.type";

/** 上流 API（オーダーシステム）から返却される生データ */
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
}

/** 上流のステータス値をフロント型にマッピングする */
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

/** 上流のオーダー種別をフロント型にマッピングする */
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
  return (typeMap[upstreamType] as OrderType) ?? "general";
}
