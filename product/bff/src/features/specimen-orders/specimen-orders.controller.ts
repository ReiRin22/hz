import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseEnumPipe,
  Post,
  Query,
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { SpecimenOrdersService } from "./specimen-orders.service";
import type { ConfirmSpecimenOrdersRequest } from "./types/specimen-orders.api.request";
import type {
  GetSpecimenHistoryResponse,
  GetSpecimenSetsResponse,
  ConfirmSpecimenOrdersResponse,
  GetSpecimenItemsResponse,
} from "./types/specimen-orders.api.response";

export type SpecimenSetType = "hospital" | "department" | "my" | "regular";

enum SpecimenSetTypeEnum {
  hospital = "hospital",
  department = "department",
  my = "my",
  regular = "regular",
}

@Controller("patients/:patientId")
export class SpecimenHistoryController {
  constructor(
    @Inject(SpecimenOrdersService)
    private readonly specimenOrdersService: SpecimenOrdersService
  ) {}

  /** GET /bff/patients/:patientId/specimenHistory */
  @Get("specimen-history")
  async getSpecimenHistory(
    @Param("patientId") patientId: string,
    @Headers("x-correlation-id") correlationId?: string,
    @Headers("x-tenant-id") tenantId?: string,
    @Headers("authorization") authHeader?: string
  ): Promise<GetSpecimenHistoryResponse> {
    return this.specimenOrdersService.getSpecimenHistory(patientId, correlationId ?? randomUUID(), tenantId ?? "", authHeader);
  }

  /** POST /bff/patients/:patientId/specimenOrders */
  @Post("specimen-orders")
  @HttpCode(HttpStatus.CREATED)
  async confirmSpecimenOrders(
    @Param("patientId") patientId: string,
    @Body() body: ConfirmSpecimenOrdersRequest,
    @Headers("x-correlation-id") correlationId?: string,
    @Headers("x-tenant-id") tenantId?: string,
    @Headers("authorization") authHeader?: string
  ): Promise<ConfirmSpecimenOrdersResponse> {
    return this.specimenOrdersService.confirmSpecimenOrders(patientId, body, correlationId ?? randomUUID(), tenantId ?? "", authHeader);
  }
}

@Controller("master")
export class SpecimenItemsMasterController {
  constructor(
    @Inject(SpecimenOrdersService)
    private readonly specimenOrdersService: SpecimenOrdersService
  ) {}

  /** GET /bff/master/specimenItems */
  @Get("specimen-items")
  async getSpecimenItems(
    @Headers("x-correlation-id") correlationId?: string,
    @Headers("x-tenant-id") tenantId?: string,
    @Headers("authorization") authHeader?: string
  ): Promise<GetSpecimenItemsResponse> {
    return this.specimenOrdersService.getSpecimenItems(correlationId ?? randomUUID(), tenantId ?? "", authHeader);
  }
}

@Controller("order-sets")
export class SpecimenSetsController {
  constructor(
    @Inject(SpecimenOrdersService)
    private readonly specimenOrdersService: SpecimenOrdersService
  ) {}

  /** GET /bff/orderSets/specimenSets?setType=hospital|department|my|regular */
  @Get("specimen-sets")
  async getSpecimenSets(
    @Query("setType", new ParseEnumPipe(SpecimenSetTypeEnum, { optional: true }))
    setType: SpecimenSetType = "hospital",
    @Headers("x-correlation-id") correlationId?: string,
    @Headers("x-tenant-id") tenantId?: string,
    @Headers("authorization") authHeader?: string
  ): Promise<GetSpecimenSetsResponse> {
    return this.specimenOrdersService.getSpecimenSets(setType, correlationId ?? randomUUID(), tenantId ?? "", authHeader);
  }
}
