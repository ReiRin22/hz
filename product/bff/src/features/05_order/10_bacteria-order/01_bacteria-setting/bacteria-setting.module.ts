import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BacteriaSettingController } from './bacteria-setting.controller';
import { BacteriaSettingService } from './bacteria-setting.service';
import { BacteriaSettingClient } from './bacteria-setting.client';

@Module({
  imports: [HttpModule],
  controllers: [BacteriaSettingController],
  providers: [BacteriaSettingService, BacteriaSettingClient],
})
export class BacteriaSettingModule {}
