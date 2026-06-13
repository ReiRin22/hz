import {
  BadRequestException,
  Controller,
  Get,
  Inject,
  PipeTransform,
  Query,
} from "@nestjs/common";
import { ReceptionPatientsService } from "./reception-patients.service";
import type { GetReceptionPatientsResponse } from "./types/reception-patients.api.response";

/** YYYY-MM-DD 形式のクエリパラメータを検証するパイプ */
class ParseDatePipe implements PipeTransform<unknown, string> {
  transform(value: unknown): string {
    if (value === undefined) {
      // JST (UTC+9) 基準で当日日付を返す
      return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split("T")[0]!;
    }
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      throw new BadRequestException(`Invalid date format: "${value}". Expected YYYY-MM-DD.`);
    }
    return value;
  }
}

@Controller("reception-patients")
export class ReceptionPatientsController {
  constructor(
    @Inject(ReceptionPatientsService)
    private readonly receptionPatientsService: ReceptionPatientsService,
  ) {}

  @Get()
  async getReceptionPatients(
    @Query("date", ParseDatePipe) date: string,
  ): Promise<GetReceptionPatientsResponse> {
    // TODO: GetReceptionPatientsRequest の departmentId / doctorIds / showCompleted / showReservations
    // は現時点でフロントエンド側でフィルタリング。上流 API 連携時に BFF 側フィルタリングへ移行する場合は追加実装が必要。
    return this.receptionPatientsService.getReceptionPatients(date);
  }
}
