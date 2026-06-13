import { Module } from "@nestjs/common";
import { MedicalFormsController } from "./medical-forms.controller";
import { MedicalFormsService } from "./medical-forms.service";
import { MedicalFormsClient } from "./medical-forms.client";
import { OrdersModule } from "../orders/orders.module";

@Module({
  imports: [OrdersModule],
  controllers: [MedicalFormsController],
  providers: [MedicalFormsService, MedicalFormsClient],
})
export class MedicalFormsModule {}
