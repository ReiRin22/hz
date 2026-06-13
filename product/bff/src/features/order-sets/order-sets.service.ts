import { Injectable, Inject } from "@nestjs/common";
import { OrderSetsClient } from "./order-sets.client";
import type { UpstreamMySet, UpstreamCompositeSet, UpstreamOrderItem } from "./types/order-sets.type";
import type {
  SetDataResponse,
  OrderItemResponse,
  GetMySetsResponse,
  GetCompositeSetsResponse,
  GetAvailableOrdersResponse,
  CreateMySetResponse,
} from "./types/order-sets.api.response";
import type { CreateMySetRequest, GetCompositeSetsOrderType } from "./types/order-sets.api.request";

@Injectable()
export class OrderSetsService {
  constructor(@Inject(OrderSetsClient) private readonly orderSetsClient: OrderSetsClient) {}

  async getMySets(): Promise<GetMySetsResponse> {
    const upstream = await this.orderSetsClient.fetchMySets();
    return { mySets: upstream.map((s) => this.transformSet(s)) };
  }

  async getCompositeSets(orderType: GetCompositeSetsOrderType): Promise<GetCompositeSetsResponse> {
    const upstream = await this.orderSetsClient.fetchCompositeSets(orderType);
    return { compositeSets: upstream.map((s) => this.transformSet(s)) };
  }

  async getAvailableOrders(): Promise<GetAvailableOrdersResponse> {
    const upstream = await this.orderSetsClient.fetchAvailableOrders();
    return { availableOrders: upstream.map((o) => this.transformOrder(o)) };
  }

  async createMySet(req: CreateMySetRequest): Promise<CreateMySetResponse> {
    const upstream = await this.orderSetsClient.saveMySet(req);
    return {
      id: upstream.setId,
      name: upstream.setName,
      description: upstream.setDescription,
      items: upstream.orderItems,
    };
  }

  private transformSet(upstream: UpstreamMySet | UpstreamCompositeSet): SetDataResponse {
    return {
      id: upstream.setId,
      name: upstream.setName,
      description: upstream.setDescription,
      items: upstream.orderItems,
    };
  }

  private transformOrder(upstream: UpstreamOrderItem): OrderItemResponse {
    return {
      id: upstream.orderId,
      name: upstream.orderName,
      type: upstream.orderType,
    };
  }
}
