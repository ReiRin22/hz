import { Controller, Get, Inject, Param, Query } from "@nestjs/common";
import { MedicalFormsService } from "./medical-forms.service";
import { OrdersService } from "../orders/orders.service";
import type { GetMedicalFormsResponse } from "./types/medical-forms.api.response";

@Controller("patients/:patientId")
export class MedicalFormsController {
  constructor(
    @Inject(MedicalFormsService) private readonly medicalFormsService: MedicalFormsService,
    @Inject(OrdersService) private readonly ordersService: OrdersService,
  ) {}

  /** GET /bff/patients/:patientId/medicalForms?orderIds=id1,id2 */
  @Get("medical-forms")
  async getMedicalForms(
    @Param("patientId") patientId: string,
    @Query("orderIds") orderIdsParam?: string,
  ): Promise<GetMedicalFormsResponse> {
    const orderIds = orderIdsParam ? orderIdsParam.split(",") : undefined;
    const { orders } = await this.ordersService.getOrders(patientId, "confirmed");
    return this.medicalFormsService.getMedicalForms(patientId, orders, orderIds);
  }
}
