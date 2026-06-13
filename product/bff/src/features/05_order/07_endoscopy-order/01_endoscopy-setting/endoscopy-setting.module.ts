import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EndoscopySettingController } from './endoscopy-setting.controller';
import { EndoscopySettingService } from './endoscopy-setting.service';
import { EndoscopySettingClient } from './endoscopy-setting.client';

@Module({
  imports: [HttpModule],
  controllers: [EndoscopySettingController],
  providers: [EndoscopySettingService, EndoscopySettingClient],
})
export class EndoscopySettingModule {}
