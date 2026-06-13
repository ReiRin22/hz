import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GeneralSettingController } from './general-setting.controller';
import { GeneralSettingService } from './general-setting.service';
import { GeneralSettingClient } from './general-setting.client';

@Module({
  imports: [HttpModule],
  controllers: [GeneralSettingController],
  providers: [GeneralSettingService, GeneralSettingClient],
})
export class GeneralSettingModule {}
