import { Injectable } from "@nestjs/common";
import { axiosClient } from "@shared/plugins/bffAxiosClient";
import type { UpstreamOrder, UpstreamMedicalForm, UpstreamOrderType } from "./types/order-confirmation.type";

@Injectable()
export class OrderConfirmationClient {
  async fetchOrders(
    patientId: string,
    status: "pending" | "confirmed" | undefined,
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<UpstreamOrder[]> {
    const response = await axiosClient.post<{ orders: UpstreamOrder[] }>(
      "/api/v1/orders/list",
      { patientId, ...(status && { status }) },
      { headers: { "X-Correlation-Id": correlationId, "X-Tenant-Id": tenantId, ...(authHeader && { Authorization: authHeader }) } },
    );
    return response.data.orders;
  }

  async confirmOrders(
    patientId: string,
    orderIds: string[],
    confirmedBy: string,
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<UpstreamOrder[]> {
    const response = await axiosClient.post<{ confirmedOrders: UpstreamOrder[] }>(
      `/api/v1/patients/${patientId}/orders/confirm`,
      { orderIds, confirmedBy },
      { headers: { "X-Correlation-Id": correlationId, "X-Tenant-Id": tenantId, ...(authHeader && { Authorization: authHeader }) } },
    );
    return response.data.confirmedOrders;
  }

  async deleteOrder(
    orderId: string,
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<void> {
    await axiosClient.delete(`/api/v1/orders/${orderId}`, {
      headers: { "X-Correlation-Id": correlationId, "X-Tenant-Id": tenantId, ...(authHeader && { Authorization: authHeader }) },
    });
  }

  async revokeOrder(
    orderId: string,
    revokedBy: string,
    reason: string,
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<UpstreamOrder> {
    const response = await axiosClient.post<{ order: UpstreamOrder }>(
      `/api/v1/orders/${orderId}/revoke`,
      { revokedBy, reason },
      { headers: { "X-Correlation-Id": correlationId, "X-Tenant-Id": tenantId, ...(authHeader && { Authorization: authHeader }) } },
    );
    return response.data.order;
  }

  async fetchForms(
    patientId: string,
    orderIds: string[] | undefined,
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<UpstreamMedicalForm[]> {
    const response = await axiosClient.post<{ forms: UpstreamMedicalForm[] }>(
      "/api/v1/orders/forms",
      { patientId, ...(orderIds && { orderIds }) },
      { headers: { "X-Correlation-Id": correlationId, "X-Tenant-Id": tenantId, ...(authHeader && { Authorization: authHeader }) } },
    );
    return response.data.forms;
  }

  async outputForms(
    patientId: string,
    formIds: string[],
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<Array<{ formId: string; pdfUrl: string }>> {
    const response = await axiosClient.post<{ outputForms: Array<{ formId: string; pdfUrl: string }> }>(
      `/api/v1/patients/${patientId}/medical-forms/output`,
      { formIds },
      { headers: { "X-Correlation-Id": correlationId, "X-Tenant-Id": tenantId, ...(authHeader && { Authorization: authHeader }) } },
    );
    return response.data.outputForms.map((f) => ({ formId: f.formId, pdfUrl: f.pdfUrl }));
  }

  async resetOrders(
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<void> {
    await axiosClient.post(
      "/api/v1/dev/reset-orders",
      {},
      { headers: { "X-Correlation-Id": correlationId, "X-Tenant-Id": tenantId, ...(authHeader && { Authorization: authHeader }) } },
    );
  }

  async fetchOrderTypes(
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined,
  ): Promise<UpstreamOrderType[]> {
    const response = await axiosClient.get<{ orderTypes: UpstreamOrderType[] }>(
      "/api/v1/order-types",
      { headers: { "X-Correlation-Id": correlationId, "X-Tenant-Id": tenantId, ...(authHeader && { Authorization: authHeader }) } },
    );
    return response.data.orderTypes;
  }
}
