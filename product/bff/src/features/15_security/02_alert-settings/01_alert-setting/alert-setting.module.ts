import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AlertSettingController } from './alert-setting.controller';
import { AlertSettingService } from './alert-setting.service';
import { AlertSettingClient } from './alert-setting.client';

@Module({
  imports: [HttpModule],
  controllers: [AlertSettingController],
  providers: [AlertSettingService, AlertSettingClient],
})
export class AlertSettingModule {}
