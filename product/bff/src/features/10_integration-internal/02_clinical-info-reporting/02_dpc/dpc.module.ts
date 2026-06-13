import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DpcController } from './dpc.controller';
import { DpcService } from './dpc.service';
import { DpcClient } from './dpc.client';

@Module({
  imports: [HttpModule],
  controllers: [DpcController],
  providers: [DpcService, DpcClient],
})
export class DpcModule {}
