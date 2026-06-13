import { Body, Controller, Get, Inject, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { OrdersService } from "./orders.service";
import type {
  ConfirmOrdersRequest,
  CancelOrderRequest,
  UpdateOrderRequest,
} from "./types/orders.api.request";
import type {
  GetOrdersResponse,
  ConfirmOrdersResponse,
  CancelOrderResponse,
  UpdateOrderResponse,
} from "./types/orders.api.response";

@Controller("patients/:patientId")
export class OrdersController {
  constructor(@Inject(OrdersService) private readonly ordersService: OrdersService) {}

  /** GET /bff/patients/:patientId/orders?status=pending|confirmed */
  @Get("orders")
  async getOrders(
    @Param("patientId") patientId: string,
    @Query("status") status?: "pending" | "confirmed",
  ): Promise<GetOrdersResponse> {
    return this.ordersService.getOrders(patientId, status);
  }

  /** POST /bff/patients/:patientId/orders/confirm */
  @Post("orders/confirm")
  async confirmOrders(
    @Param("patientId") patientId: string,
    @Body() body: ConfirmOrdersRequest,
  ): Promise<ConfirmOrdersResponse> {
    return this.ordersService.confirmOrders(patientId, body);
  }

  /** PATCH /bff/patients/:patientId/orders/:orderId/cancel */
  @Patch("orders/:orderId/cancel")
  async cancelOrder(
    @Param("patientId") patientId: string,
    @Param("orderId") orderId: string,
    @Body() body: CancelOrderRequest,
  ): Promise<CancelOrderResponse> {
    return this.ordersService.cancelOrder(patientId, orderId, body);
  }

  /** PUT /bff/patients/:patientId/orders/:orderId */
  @Put("orders/:orderId")
  async updateOrder(
    @Param("patientId") patientId: string,
    @Param("orderId") orderId: string,
    @Body() body: UpdateOrderRequest,
  ): Promise<UpdateOrderResponse> {
    return this.ordersService.updateOrder(patientId, orderId, body);
  }
}
