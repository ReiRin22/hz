import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ImagingSettingController } from './imaging-setting.controller';
import { ImagingSettingService } from './imaging-setting.service';
import { ImagingSettingClient } from './imaging-setting.client';

@Module({
  imports: [HttpModule],
  controllers: [ImagingSettingController],
  providers: [ImagingSettingService, ImagingSettingClient],
})
export class ImagingSettingModule {}
