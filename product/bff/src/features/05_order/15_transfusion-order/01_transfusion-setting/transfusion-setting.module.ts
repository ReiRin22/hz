import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TransfusionSettingController } from './transfusion-setting.controller';
import { TransfusionSettingService } from './transfusion-setting.service';
import { TransfusionSettingClient } from './transfusion-setting.client';

@Module({
  imports: [HttpModule],
  controllers: [TransfusionSettingController],
  providers: [TransfusionSettingService, TransfusionSettingClient],
})
export class TransfusionSettingModule {}
