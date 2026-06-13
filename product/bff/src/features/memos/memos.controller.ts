import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Inject,
} from "@nestjs/common";
import { MemosService } from "./memos.service";
import type { CreateMemoRequest } from "./types/memos.api.request";
import type {
  GetMemosResponse,
  CreateMemoResponse,
  ConfirmMemoResponse,
} from "./types/memos.api.response";

@Controller("memos")
export class MemosController {
  constructor(@Inject(MemosService) private readonly memosService: MemosService) {}

  @Get()
  async getMemos(@Query("type") type: string | undefined): Promise<GetMemosResponse> {
    return this.memosService.getMemos(type);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createMemo(
    @Body() body: CreateMemoRequest,
  ): Promise<CreateMemoResponse> {
    return this.memosService.createMemo(body);
  }

  @Patch(":memoId/confirm")
  async confirmMemo(
    @Param("memoId") memoId: string,
  ): Promise<ConfirmMemoResponse> {
    return this.memosService.confirmMemo(memoId);
  }
}
