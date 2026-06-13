import { Injectable } from "@nestjs/common";
import { axiosClient } from "@shared/plugins/bffAxiosClient";
import type { ConfirmSpecimenOrdersRequest } from "./types/specimen-orders.api.request";
import type {
  UpstreamSpecimenHistoryItem,
  UpstreamSpecimenSet,
  UpstreamConfirmedSpecimenOrder,
  UpstreamSpecimenItem,
} from "./types/specimen-orders.type";

@Injectable()
export class SpecimenOrdersClient {
  async fetchSpecimenHistory(
    patientId: string,
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined
  ): Promise<UpstreamSpecimenHistoryItem[]> {
    const response = await axiosClient.get<{ history: UpstreamSpecimenHistoryItem[] }>(
      `/api/v1/patients/${patientId}/specimen-history`,
      { headers: { "X-Correlation-Id": correlationId, "X-Tenant-Id": tenantId, ...(authHeader && { Authorization: authHeader }) } }
    );
    return response.data.history;
  }

  async fetchSpecimenSets(
    setType: "hospital" | "department" | "my" | "regular",
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined
  ): Promise<UpstreamSpecimenSet[]> {
    const response = await axiosClient.get<{ specimenSets: UpstreamSpecimenSet[] }>(
      "/api/v1/order-sets/specimen-sets",
      {
        params: { setType },
        headers: { "X-Correlation-Id": correlationId, "X-Tenant-Id": tenantId, ...(authHeader && { Authorization: authHeader }) },
      }
    );
    return response.data.specimenSets;
  }

  async fetchSpecimenItems(
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined
  ): Promise<UpstreamSpecimenItem[]> {
    const response = await axiosClient.get<{ items: UpstreamSpecimenItem[] }>(
      "/api/v1/master/specimen-items",
      { headers: { "X-Correlation-Id": correlationId, "X-Tenant-Id": tenantId, ...(authHeader && { Authorization: authHeader }) } }
    );
    return response.data.items;
  }

  async confirmSpecimenOrders(
    patientId: string,
    data: ConfirmSpecimenOrdersRequest,
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined
  ): Promise<UpstreamConfirmedSpecimenOrder[]> {
    const response = await axiosClient.post<{ confirmedOrders: UpstreamConfirmedSpecimenOrder[] }>(
      `/api/v1/patients/${patientId}/specimen-orders`,
      data,
      { headers: { "X-Correlation-Id": correlationId, "X-Tenant-Id": tenantId, ...(authHeader && { Authorization: authHeader }) } }
    );
    return response.data.confirmedOrders;
  }
}
