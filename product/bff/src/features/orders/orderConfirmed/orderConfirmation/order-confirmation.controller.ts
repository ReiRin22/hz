import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { OrderConfirmationService } from "./order-confirmation.service";
import type {
  GetOrdersRequest,
  GetMedicalFormsRequest,
  ConfirmOrdersRequest,
  RevokeOrderRequest,
  OutputMedicalFormsRequest,
} from "./types/order-confirmation.api.request";
import type {
  GetOrdersResponse,
  ConfirmOrdersResponse,
  RevokeOrderResponse,
  GetMedicalFormsResponse,
  OutputMedicalFormsResponse,
  GetOrderTypesResponse,
} from "./types/order-confirmation.api.response";

@Controller("orders")
export class OrderConfirmationController {
  constructor(
    @Inject(OrderConfirmationService)
    private readonly service: OrderConfirmationService,
  ) {}

  /** POST /bff/orders */
  @Post()
  async getOrders(
    @Body() body: GetOrdersRequest,
    @Headers("x-tenant-id") tenantId?: string,
    @Headers("x-correlation-id") correlationId?: string,
    @Headers("authorization") authHeader?: string,
  ): Promise<GetOrdersResponse> {
    return this.service.getOrders(body.patientId, body.status, correlationId ?? randomUUID(), tenantId ?? "", authHeader);
  }

  /** POST /bff/orders/confirm */
  @Post("confirm")
  @HttpCode(HttpStatus.OK)
  async confirmOrders(
    @Body() body: ConfirmOrdersRequest,
    @Headers("x-tenant-id") tenantId?: string,
    @Headers("x-correlation-id") correlationId?: string,
    @Headers("authorization") authHeader?: string,
  ): Promise<ConfirmOrdersResponse> {
    return this.service.confirmOrders(body, correlationId ?? randomUUID(), tenantId ?? "", authHeader);
  }

  /** DELETE /bff/orders/:orderId */
  @Delete(":orderId")
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOrder(
    @Param("orderId") orderId: string,
    @Headers("x-tenant-id") tenantId?: string,
    @Headers("x-correlation-id") correlationId?: string,
    @Headers("authorization") authHeader?: string,
  ): Promise<void> {
    await this.service.deleteOrder(orderId, correlationId ?? randomUUID(), tenantId ?? "", authHeader);
  }

  /** POST /bff/orders/:orderId/revoke */
  @Post(":orderId/revoke")
  @HttpCode(HttpStatus.OK)
  async revokeOrder(
    @Param("orderId") orderId: string,
    @Body() body: RevokeOrderRequest,
    @Headers("x-tenant-id") tenantId?: string,
    @Headers("x-correlation-id") correlationId?: string,
    @Headers("authorization") authHeader?: string,
  ): Promise<RevokeOrderResponse> {
    return this.service.revokeOrder(orderId, body, correlationId ?? randomUUID(), tenantId ?? "", authHeader);
  }

  /** POST /bff/orders/forms */
  @Post("forms")
  async getForms(
    @Body() body: GetMedicalFormsRequest,
    @Headers("x-tenant-id") tenantId?: string,
    @Headers("x-correlation-id") correlationId?: string,
    @Headers("authorization") authHeader?: string,
  ): Promise<GetMedicalFormsResponse> {
    return this.service.getForms(body.patientId, body.orderIds, correlationId ?? randomUUID(), tenantId ?? "", authHeader);
  }

  /** POST /bff/orders/forms/output */
  @Post("forms/output")
  @HttpCode(HttpStatus.OK)
  async outputForms(
    @Body() body: OutputMedicalFormsRequest,
    @Headers("x-tenant-id") tenantId?: string,
    @Headers("x-correlation-id") correlationId?: string,
    @Headers("authorization") authHeader?: string,
  ): Promise<OutputMedicalFormsResponse> {
    return this.service.outputForms(body, correlationId ?? randomUUID(), tenantId ?? "", authHeader);
  }
}

// TODO: 本実装時（DB永続化後）はこのコントローラーごと削除すること
@Controller("dev")
export class DevController {
  constructor(
    @Inject(OrderConfirmationService)
    private readonly service: OrderConfirmationService,
  ) {}

  /** POST /bff/dev/resetOrders（開発用ストアリセット） */
  @Post("reset-orders")
  @HttpCode(HttpStatus.NO_CONTENT)
  async resetOrders(
    @Headers("x-tenant-id") tenantId?: string,
    @Headers("x-correlation-id") correlationId?: string,
    @Headers("authorization") authHeader?: string,
  ): Promise<void> {
    await this.service.resetOrders(correlationId ?? randomUUID(), tenantId ?? "", authHeader);
  }
}

@Controller("order-types")
export class OrderTypesController {
  constructor(
    @Inject(OrderConfirmationService)
    private readonly service: OrderConfirmationService,
  ) {}

  /** GET /bff/orderTypes */
  @Get()
  async getOrderTypes(
    @Headers("x-tenant-id") tenantId?: string,
    @Headers("x-correlation-id") correlationId?: string,
    @Headers("authorization") authHeader?: string,
  ): Promise<GetOrderTypesResponse> {
    return this.service.getOrderTypes(correlationId ?? randomUUID(), tenantId ?? "", authHeader);
  }
}
