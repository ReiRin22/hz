import { Controller, Get, Post, Body, Query, Inject, HttpCode, HttpStatus, ParseEnumPipe } from "@nestjs/common";
import { OrderSetsService } from "./order-sets.service";
import type {
  GetMySetsResponse,
  GetCompositeSetsResponse,
  GetAvailableOrdersResponse,
  CreateMySetResponse,
} from "./types/order-sets.api.response";
import type { CreateMySetRequest, GetCompositeSetsOrderType } from "./types/order-sets.api.request";

enum CompositeSetsOrderTypeEnum {
  prescription = "prescription",
  injection = "injection",
  lab = "lab",
}

@Controller("order-sets")
export class OrderSetsController {
  constructor(@Inject(OrderSetsService) private readonly orderSetsService: OrderSetsService) {}

  /** GET /bff/orderSets/mySets */
  @Get("my-sets")
  async getMySets(): Promise<GetMySetsResponse> {
    return this.orderSetsService.getMySets();
  }

  /** POST /bff/orderSets/mySets */
  @Post("my-sets")
  @HttpCode(HttpStatus.CREATED)
  async createMySet(@Body() body: CreateMySetRequest): Promise<CreateMySetResponse> {
    return this.orderSetsService.createMySet(body);
  }

  /** GET /bff/orderSets/compositeSets?orderType=prescription|injection|lab */
  @Get("composite-sets")
  async getCompositeSets(
    @Query("orderType", new ParseEnumPipe(CompositeSetsOrderTypeEnum, { optional: true }))
    orderType: GetCompositeSetsOrderType = "prescription"
  ): Promise<GetCompositeSetsResponse> {
    return this.orderSetsService.getCompositeSets(orderType);
  }

  /** GET /bff/orderSets/availableOrders */
  @Get("available-orders")
  async getAvailableOrders(): Promise<GetAvailableOrdersResponse> {
    return this.orderSetsService.getAvailableOrders();
  }
}
