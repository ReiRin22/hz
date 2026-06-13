import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DialysisSettingController } from './dialysis-setting.controller';
import { DialysisSettingService } from './dialysis-setting.service';
import { DialysisSettingClient } from './dialysis-setting.client';

@Module({
  imports: [HttpModule],
  controllers: [DialysisSettingController],
  providers: [DialysisSettingService, DialysisSettingClient],
})
export class DialysisSettingModule {}
