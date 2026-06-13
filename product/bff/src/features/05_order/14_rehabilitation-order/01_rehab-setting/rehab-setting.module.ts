import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RehabSettingController } from './rehab-setting.controller';
import { RehabSettingService } from './rehab-setting.service';
import { RehabSettingClient } from './rehab-setting.client';

@Module({
  imports: [HttpModule],
  controllers: [RehabSettingController],
  providers: [RehabSettingService, RehabSettingClient],
})
export class RehabSettingModule {}
