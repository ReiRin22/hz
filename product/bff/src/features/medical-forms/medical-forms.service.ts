import { Injectable } from "@nestjs/common";
import { mapOrderTypeToFormType, mapOrderTypeToFormName } from "./types/medical-forms.type";
import type { OrderResponse } from "../orders/types/orders.api.response";
import type { MedicalFormResponse, GetMedicalFormsResponse } from "./types/medical-forms.api.response";
import type { OrderType } from "../../front_bff_shared/features/orders/_shared/types/order.type";

@Injectable()
export class MedicalFormsService {
  /**
   * 確定済みオーダーから帳票データを生成する
   * TODO: 帳票システム確定後は medicalForms.clients.ts 経由で上流 API を呼ぶ（concerns.md 参照）
   */
  async getMedicalForms(
    patientId: string,
    orders: OrderResponse[],
    orderIds?: string[],
  ): Promise<GetMedicalFormsResponse> {
    const targetOrders = orderIds
      ? orders.filter((o) => orderIds.includes(o.id))
      : orders;

    const forms: MedicalFormResponse[] = targetOrders.map((order) => {
      const formType = mapOrderTypeToFormType(order.type as OrderType);
      const formName = mapOrderTypeToFormName(order.type as OrderType);
      return {
        id: `form-${order.id}`,
        type: formType,
        name: formName,
        description: this.buildDescription(order),
        relatedOrderIds: [order.id],
        patientId,
        createdAt: order.confirmedAt
          ? new Date(order.confirmedAt).toISOString()
          : new Date().toISOString(),
        createdBy: order.confirmedBy ?? "",
        status: order.status === "confirmed" ? "PRINTED" : "READY",
        priority: order.priority === "緊急" ? "URGENT" : "NORMAL",
      };
    });

    return { forms };
  }

  private buildDescription(order: OrderResponse): string {
    if (order.dosage || order.frequency) {
      return `${order.name} - ${order.dosage ?? ""} ${order.frequency ?? ""}`.trim();
    }
    return `${order.name}の指示書`;
  }
}
