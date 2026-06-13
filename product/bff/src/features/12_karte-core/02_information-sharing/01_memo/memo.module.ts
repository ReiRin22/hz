import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MemoController } from './memo.controller';
import { MemoService } from './memo.service';
import { MemoClient } from './memo.client';

@Module({
  imports: [HttpModule],
  controllers: [MemoController],
  providers: [MemoService, MemoClient],
})
export class MemoModule {}
