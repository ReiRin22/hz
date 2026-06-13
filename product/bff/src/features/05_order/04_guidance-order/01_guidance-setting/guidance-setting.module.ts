import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GuidanceSettingController } from './guidance-setting.controller';
import { GuidanceSettingService } from './guidance-setting.service';
import { GuidanceSettingClient } from './guidance-setting.client';

@Module({
  imports: [HttpModule],
  controllers: [GuidanceSettingController],
  providers: [GuidanceSettingService, GuidanceSettingClient],
})
export class GuidanceSettingModule {}
