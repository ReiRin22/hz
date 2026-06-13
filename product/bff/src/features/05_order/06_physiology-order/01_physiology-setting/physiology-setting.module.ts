import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PhysiologySettingController } from './physiology-setting.controller';
import { PhysiologySettingService } from './physiology-setting.service';
import { PhysiologySettingClient } from './physiology-setting.client';

@Module({
  imports: [HttpModule],
  controllers: [PhysiologySettingController],
  providers: [PhysiologySettingService, PhysiologySettingClient],
})
export class PhysiologySettingModule {}
