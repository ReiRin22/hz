import { Injectable, Inject } from "@nestjs/common";
import { OrdersClient } from "./orders.client";
import { mapOrderStatus, mapOrderType } from "./types/orders.type";
import type { UpstreamOrder } from "./types/orders.type";
import type {
  OrderResponse,
  GetOrdersResponse,
  ConfirmOrdersResponse,
  CancelOrderResponse,
  UpdateOrderResponse,
} from "./types/orders.api.response";
import type {
  ConfirmOrdersRequest,
  CancelOrderRequest,
  UpdateOrderRequest,
} from "./types/orders.api.request";

@Injectable()
export class OrdersService {
  constructor(@Inject(OrdersClient) private readonly ordersClient: OrdersClient) {}

  async getOrders(patientId: string, status?: "pending" | "confirmed"): Promise<GetOrdersResponse> {
    const upstream = await this.ordersClient.fetchOrders(patientId, status);
    return { orders: upstream.map((o) => this.transform(o)) };
  }

  async confirmOrders(patientId: string, body: ConfirmOrdersRequest): Promise<ConfirmOrdersResponse> {
    const upstream = await this.ordersClient.confirmOrders(patientId, body.orderIds, body.confirmedBy);
    return { confirmedOrders: upstream.map((o) => this.transform(o)) };
  }

  async cancelOrder(patientId: string, orderId: string, body: CancelOrderRequest): Promise<CancelOrderResponse> {
    const upstream = await this.ordersClient.cancelOrder(patientId, orderId, body.cancelledBy, body.reason);
    return { order: this.transform(upstream) };
  }

  async updateOrder(patientId: string, orderId: string, body: UpdateOrderRequest): Promise<UpdateOrderResponse> {
    const upstream = await this.ordersClient.updateOrder(patientId, orderId, body.order);
    return { order: this.transform(upstream) };
  }

  private transform(upstream: UpstreamOrder): OrderResponse {
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
    };
  }
}
