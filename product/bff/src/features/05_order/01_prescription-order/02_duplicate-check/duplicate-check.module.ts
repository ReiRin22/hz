import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DuplicateCheckController } from './duplicate-check.controller';
import { DuplicateCheckService } from './duplicate-check.service';
import { DuplicateCheckClient } from './duplicate-check.client';

@Module({
  imports: [HttpModule],
  controllers: [DuplicateCheckController],
  providers: [DuplicateCheckService, DuplicateCheckClient],
})
export class DuplicateCheckModule {}
