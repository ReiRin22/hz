import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { SpecimenOrdersClient } from "./specimen-orders.client";
import type {
  UpstreamSpecimenHistoryItem,
  UpstreamSpecimenSet,
  UpstreamConfirmedSpecimenOrder,
} from "./types/specimen-orders.type";
import type {
  SpecimenHistoryItemResponse,
  SpecimenSetItemResponse,
  GetSpecimenHistoryResponse,
  GetSpecimenSetsResponse,
  ConfirmSpecimenOrdersResponse,
  SpecimenOrderConfirmedResponse,
  SpecimenItemResponse,
  GetSpecimenItemsResponse,
} from "./types/specimen-orders.api.response";
import type { ConfirmSpecimenOrdersRequest } from "./types/specimen-orders.api.request";

@Injectable()
export class SpecimenOrdersService {
  constructor(
    @Inject(SpecimenOrdersClient)
    private readonly specimenOrdersClient: SpecimenOrdersClient
  ) {}

  async getSpecimenHistory(
    patientId: string,
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined
  ): Promise<GetSpecimenHistoryResponse> {
    try {
      const upstream = await this.specimenOrdersClient.fetchSpecimenHistory(patientId, correlationId, tenantId, authHeader);
      return { history: upstream.map((item) => this.transformHistoryItem(item)) };
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new HttpException({ type: "SYSTEM_ERROR", code: "SYSTEM_ERROR" }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getSpecimenItems(
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined
  ): Promise<GetSpecimenItemsResponse> {
    try {
      const upstream = await this.specimenOrdersClient.fetchSpecimenItems(correlationId, tenantId, authHeader);
      const items: SpecimenItemResponse[] = upstream.map((item) => ({
        code: item.code,
        name: item.name,
        specimenType: item.specimenType,
        category: item.category,
      }));
      return { items };
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new HttpException({ type: "SYSTEM_ERROR", code: "SYSTEM_ERROR" }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getSpecimenSets(
    setType: "hospital" | "department" | "my" | "regular",
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined
  ): Promise<GetSpecimenSetsResponse> {
    try {
      const upstream = await this.specimenOrdersClient.fetchSpecimenSets(setType, correlationId, tenantId, authHeader);
      return { specimenSets: upstream.map((set) => this.transformSet(set)) };
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new HttpException({ type: "SYSTEM_ERROR", code: "SYSTEM_ERROR" }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async confirmSpecimenOrders(
    patientId: string,
    body: ConfirmSpecimenOrdersRequest,
    correlationId: string,
    tenantId: string,
    authHeader: string | undefined
  ): Promise<ConfirmSpecimenOrdersResponse> {
    try {
      const upstream = await this.specimenOrdersClient.confirmSpecimenOrders(patientId, body, correlationId, tenantId, authHeader);
      return { confirmedOrders: upstream.map((order) => this.transformConfirmedOrder(order)) };
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new HttpException({ type: "SYSTEM_ERROR", code: "SYSTEM_ERROR" }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private transformHistoryItem(upstream: UpstreamSpecimenHistoryItem): SpecimenHistoryItemResponse {
    return {
      id: upstream.id,
      date: upstream.date,
      testName: upstream.testName,
      orderCode: upstream.orderCode,
      specimenType: upstream.specimenType,
      status: upstream.status,
      confirmedAt: upstream.confirmedAt,
      confirmedBy: upstream.confirmedBy,
      ...(upstream.category !== undefined && { category: upstream.category }),
      ...(upstream.quantity !== undefined && { quantity: upstream.quantity }),
      ...(upstream.priority !== undefined && { priority: upstream.priority }),
      ...(upstream.clinicalPurpose !== undefined && { clinicalPurpose: upstream.clinicalPurpose }),
      ...(upstream.specialInstructions !== undefined && { specialInstructions: upstream.specialInstructions }),
    };
  }

  private transformSet(upstream: UpstreamSpecimenSet): SpecimenSetItemResponse {
    return {
      id: upstream.id,
      name: upstream.name,
      description: upstream.description,
      setType: upstream.setType,
      items: upstream.items.map((item) => this.transformHistoryItem(item)),
    };
  }

  private transformConfirmedOrder(
    upstream: UpstreamConfirmedSpecimenOrder
  ): SpecimenOrderConfirmedResponse {
    return {
      id: upstream.id,
      testName: upstream.testName,
      orderCode: upstream.orderCode,
      specimenType: upstream.specimenType,
      status: "confirmed" as const,
      confirmedAt: upstream.confirmedAt,
      confirmedBy: upstream.confirmedBy,
    };
  }
}
