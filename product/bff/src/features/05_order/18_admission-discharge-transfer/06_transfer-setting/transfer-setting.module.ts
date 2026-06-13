import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TransferSettingController } from './transfer-setting.controller';
import { TransferSettingService } from './transfer-setting.service';
import { TransferSettingClient } from './transfer-setting.client';

@Module({
  imports: [HttpModule],
  controllers: [TransferSettingController],
  providers: [TransferSettingService, TransferSettingClient],
})
export class TransferSettingModule {}
