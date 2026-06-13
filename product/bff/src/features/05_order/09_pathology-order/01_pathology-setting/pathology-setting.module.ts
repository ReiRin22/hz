import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PathologySettingController } from './pathology-setting.controller';
import { PathologySettingService } from './pathology-setting.service';
import { PathologySettingClient } from './pathology-setting.client';

@Module({
  imports: [HttpModule],
  controllers: [PathologySettingController],
  providers: [PathologySettingService, PathologySettingClient],
})
export class PathologySettingModule {}
