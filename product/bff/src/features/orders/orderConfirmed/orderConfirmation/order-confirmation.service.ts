import { Injectable, Inject } from "@nestjs/common";
import { OrderConfirmationClient } from "./order-confirmation.client";
import { mapOrderStatus, mapOrderType } from "./types/order-confirmation.type";
import type { UpstreamOrder } from "./types/order-confirmation.type";
import type {
  MedicalFormType,
  OrderResponse,
  GetOrdersResponse,
  ConfirmOrdersResponse,
  RevokeOrderResponse,
  GetMedicalFormsResponse,
  OutputMedicalFormsResponse,
  GetOrderTypesResponse,
} from "./types/order-confirmation.api.response";
import type {
  ConfirmOrdersRequest,
  RevokeOrderRequest,
  OutputMedicalFormsRequest,
} from "./types/order-confirmation.api.request";

const MEDICAL_FORM_TYPES = [
  "PRESCRIPTION",
  "LAB_REQUEST",
  "IMAGING_REQUEST",
  "PROCEDURE_CONSENT",
  "NURSING_INSTRUCTION",
  "REFERRAL",
  "DISCHARGE_SUMMARY",
] as const satisfies readonly MedicalFormType[];

function toMedicalFormType(raw: string): MedicalFormType {
  return (MEDICAL_FORM_TYPES as readonly string[]).includes(raw)
    ? (raw as MedicalFormType)
    : "PRESCRIPTION";
}

@Injectable()
export class OrderConfirmationService {
  constructor(
    @Inject(OrderConfirmationClient)
    private readonly client: OrderConfirmationClient,
  ) {}

  async getOrders(
    patientId: string,
    status: "pending" | "confirmed" | undefined,
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<GetOrdersResponse> {
    const upstream = await this.client.fetchOrders(patientId, status, correlationId, tenantId, authHeader);
    return { orders: upstream.map((o) => this.transformOrder(o)) };
  }

  async confirmOrders(
    body: ConfirmOrdersRequest,
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<ConfirmOrdersResponse> {
    const upstream = await this.client.confirmOrders(body.patientId, body.orderIds, body.confirmedBy, correlationId, tenantId, authHeader);
    return { confirmedOrders: upstream.map((o) => this.transformOrder(o)) };
  }

  async deleteOrder(
    orderId: string,
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<void> {
    await this.client.deleteOrder(orderId, correlationId, tenantId, authHeader);
  }

  async revokeOrder(
    orderId: string,
    body: RevokeOrderRequest,
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<RevokeOrderResponse> {
    const upstream = await this.client.revokeOrder(orderId, body.revokedBy, body.reason, correlationId, tenantId, authHeader);
    return { order: this.transformOrder(upstream) };
  }

  async getForms(
    patientId: string,
    orderIds: string[] | undefined,
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<GetMedicalFormsResponse> {
    const upstream = await this.client.fetchForms(patientId, orderIds, correlationId, tenantId, authHeader);
    return {
      forms: upstream.map((f) => ({
        id: f.formId,
        type: toMedicalFormType(f.formType),
        name: f.formName,
        description: f.description,
        relatedOrderIds: f.relatedOrderIds,
        patientId: f.patientId,
        createdAt: f.createdAt,
        createdBy: f.createdBy,
        status: f.status,
        priority: f.priority,
      })),
    };
  }

  async outputForms(
    body: OutputMedicalFormsRequest,
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<OutputMedicalFormsResponse> {
    const outputForms = await this.client.outputForms(body.patientId, body.formIds, correlationId, tenantId, authHeader);
    return { outputForms };
  }

  async resetOrders(
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<void> {
    await this.client.resetOrders(correlationId, tenantId, authHeader);
  }

  async getOrderTypes(
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<GetOrderTypesResponse> {
    const upstream = await this.client.fetchOrderTypes(correlationId, tenantId, authHeader);
    return {
      orderTypes: upstream.map((t) => ({
        id: t.id,
        name: t.name,
        route: t.route,
      })),
    };
  }

  private transformOrder(upstream: UpstreamOrder): OrderResponse {
    const status = mapOrderStatus(upstream.orderStatus);
    return {
      id: upstream.orderId,
      type: mapOrderType(upstream.orderType),
      name: upstream.orderName,
      ...(upstream.dosage !== undefined && { dosage: upstream.dosage }),
      ...(upstream.frequency !== undefined && { frequency: upstream.frequency }),
      ...(upstream.duration !== undefined && { duration: upstream.duration }),
      ...(upstream.instructions !== undefined && { instructions: upstream.instructions }),
      ...(upstream.priority !== undefined && { priority: upstream.priority }),
      ...(upstream.amount !== undefined && { amount: upstream.amount }),
      ...(upstream.scheduledAt !== undefined && { scheduledAt: upstream.scheduledAt }),
      ...(upstream.confirmedAt !== undefined && { confirmedAt: upstream.confirmedAt }),
      ...(upstream.confirmedBy !== undefined && { confirmedBy: upstream.confirmedBy }),
      ...(upstream.implementedAt !== undefined && { implementedAt: upstream.implementedAt }),
      ...(upstream.implementedBy !== undefined && { implementedBy: upstream.implementedBy }),
      ...(upstream.cancelledAt !== undefined && { cancelledAt: upstream.cancelledAt }),
      ...(upstream.cancelledBy !== undefined && { cancelledBy: upstream.cancelledBy }),
      ...(status !== undefined && { status }),
      ...(upstream.specimenSubItems != null && {
        specimenSubItems: upstream.specimenSubItems.map((item) => ({
          id: item.id,
          testName: item.testName,
          orderCode: item.orderCode,
          specimenType: item.specimenType,
          ...(item.priority !== undefined && { priority: item.priority }),
        })),
      }),
      ...(upstream.deptInstructionStatus !== undefined && { deptInstructionStatus: upstream.deptInstructionStatus }),
    };
  }
}
