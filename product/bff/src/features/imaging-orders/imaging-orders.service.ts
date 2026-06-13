import { Injectable, Inject } from "@nestjs/common";
import { ImagingOrdersClient } from "./imaging-orders.client";
import type {
  UpstreamImagingHistoryItem,
  UpstreamImagingSet,
  UpstreamConfirmedImagingOrder,
} from "./types/imaging-orders.type";
import type {
  ImagingHistoryItemResponse,
  ImagingSetItemResponse,
  GetImagingHistoryResponse,
  GetImagingSetsResponse,
  ConfirmImagingOrdersResponse,
  ImagingOrderConfirmedResponse,
} from "./types/imaging-orders.api.response";
import type { ConfirmImagingOrdersRequest } from "./types/imaging-orders.api.request";

@Injectable()
export class ImagingOrdersService {
  constructor(
    @Inject(ImagingOrdersClient)
    private readonly imagingOrdersClient: ImagingOrdersClient
  ) {}

  async getImagingHistory(patientId: string): Promise<GetImagingHistoryResponse> {
    const upstream = await this.imagingOrdersClient.fetchImagingHistory(patientId);
    return { history: upstream.map((item) => this.transformHistoryItem(item)) };
  }

  async getImagingSets(
    setType: "hospital" | "department" | "my" | "regular"
  ): Promise<GetImagingSetsResponse> {
    const upstream = await this.imagingOrdersClient.fetchImagingSets(setType);
    return { imagingSets: upstream.map((set) => this.transformSet(set)) };
  }

  async confirmImagingOrders(
    patientId: string,
    body: ConfirmImagingOrdersRequest
  ): Promise<ConfirmImagingOrdersResponse> {
    const upstream = await this.imagingOrdersClient.confirmImagingOrders(patientId, body);
    return { confirmedOrders: upstream.map((order) => this.transformConfirmedOrder(order)) };
  }

  private transformHistoryItem(upstream: UpstreamImagingHistoryItem): ImagingHistoryItemResponse {
    return {
      id: upstream.examId,
      date: upstream.examDate,
      name: upstream.examName,
      modality: upstream.modality,
      bodyPart: upstream.bodyPart,
      ...(upstream.imagingContent !== undefined && { imagingContent: upstream.imagingContent }),
      ...(upstream.protocols !== undefined && { protocols: upstream.protocols }),
      ...(upstream.position !== undefined && { position: upstream.position }),
      ...(upstream.laterality !== undefined && { laterality: upstream.laterality }),
      ...(upstream.functionalConditions !== undefined && { functionalConditions: upstream.functionalConditions }),
      ...(upstream.specialInstructions !== undefined && { specialInstructions: upstream.specialInstructions }),
      ...(upstream.bodyPartsList !== undefined && { bodyPartsList: upstream.bodyPartsList }),
      ...(upstream.priority !== undefined && { priority: upstream.priority }),
      ...(upstream.preferredTime !== undefined && { preferredTime: upstream.preferredTime }),
      ...(upstream.useContrast !== undefined && { useContrast: upstream.useContrast }),
      ...(upstream.hasContrastAllergy !== undefined && { hasAllergy: upstream.hasContrastAllergy }),
      ...(upstream.clinicalPurpose !== undefined && { clinicalPurpose: upstream.clinicalPurpose }),
      ...(upstream.symptomTags !== undefined && { symptomTags: upstream.symptomTags }),
    };
  }

  private transformSet(upstream: UpstreamImagingSet): ImagingSetItemResponse {
    return {
      id: upstream.setId,
      name: upstream.setName,
      description: upstream.setDescription,
      setType: upstream.setType,
      items: upstream.examItems.map((item) => this.transformHistoryItem(item)),
    };
  }

  private transformConfirmedOrder(
    upstream: UpstreamConfirmedImagingOrder
  ): ImagingOrderConfirmedResponse {
    return {
      id: upstream.orderId,
      name: upstream.orderName,
      modality: upstream.modality,
      status: "confirmed" as const,
      confirmedAt: upstream.confirmedAt,
      confirmedBy: upstream.confirmedBy,
    };
  }
}
