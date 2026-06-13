import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseEnumPipe,
  Post,
  Query,
} from "@nestjs/common";
import { ImagingOrdersService } from "./imaging-orders.service";
import type { ConfirmImagingOrdersRequest } from "./types/imaging-orders.api.request";
import type {
  GetImagingHistoryResponse,
  GetImagingSetsResponse,
  ConfirmImagingOrdersResponse,
} from "./types/imaging-orders.api.response";

export type ImagingSetType = "hospital" | "department" | "my" | "regular";

enum ImagingSetTypeEnum {
  hospital = "hospital",
  department = "department",
  my = "my",
  regular = "regular",
}

@Controller("patients/:patientId")
export class ImagingHistoryController {
  constructor(
    @Inject(ImagingOrdersService)
    private readonly imagingOrdersService: ImagingOrdersService
  ) {}

  /** GET /bff/patients/:patientId/imagingHistory */
  @Get("imaging-history")
  async getImagingHistory(
    @Param("patientId") patientId: string
  ): Promise<GetImagingHistoryResponse> {
    return this.imagingOrdersService.getImagingHistory(patientId);
  }

  /** POST /bff/patients/:patientId/imagingOrders */
  @Post("imaging-orders")
  @HttpCode(HttpStatus.CREATED)
  async confirmImagingOrders(
    @Param("patientId") patientId: string,
    @Body() body: ConfirmImagingOrdersRequest
  ): Promise<ConfirmImagingOrdersResponse> {
    return this.imagingOrdersService.confirmImagingOrders(patientId, body);
  }
}

@Controller("imaging-sets")
export class ImagingSetsController {
  constructor(
    @Inject(ImagingOrdersService)
    private readonly imagingOrdersService: ImagingOrdersService
  ) {}

  /** GET /bff/imagingSets?setType=hospital|department|my|regular */
  @Get()
  async getImagingSets(
    @Query("setType", new ParseEnumPipe(ImagingSetTypeEnum, { optional: true }))
    setType: ImagingSetType = "hospital"
  ): Promise<GetImagingSetsResponse> {
    return this.imagingOrdersService.getImagingSets(setType);
  }
}
