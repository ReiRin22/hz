import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DischargeSettingController } from './discharge-setting.controller';
import { DischargeSettingService } from './discharge-setting.service';
import { DischargeSettingClient } from './discharge-setting.client';

@Module({
  imports: [HttpModule],
  controllers: [DischargeSettingController],
  providers: [DischargeSettingService, DischargeSettingClient],
})
export class DischargeSettingModule {}
