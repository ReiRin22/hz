import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TransferOutputController } from './transfer-output.controller';
import { TransferOutputService } from './transfer-output.service';
import { TransferOutputClient } from './transfer-output.client';

@Module({
  imports: [HttpModule],
  controllers: [TransferOutputController],
  providers: [TransferOutputService, TransferOutputClient],
})
export class TransferOutputModule {}
