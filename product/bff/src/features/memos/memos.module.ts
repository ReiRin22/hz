import { Module } from "@nestjs/common";
import { MemosController } from "./memos.controller";
import { MemosService } from "./memos.service";
import { MemosClient } from "./memos.client";

@Module({
  controllers: [MemosController],
  providers: [MemosService, MemosClient],
})
export class MemosModule {}
