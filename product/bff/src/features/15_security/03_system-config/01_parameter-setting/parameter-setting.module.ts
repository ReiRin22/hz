import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ParameterSettingController } from './parameter-setting.controller';
import { ParameterSettingService } from './parameter-setting.service';
import { ParameterSettingClient } from './parameter-setting.client';

@Module({
  imports: [HttpModule],
  controllers: [ParameterSettingController],
  providers: [ParameterSettingService, ParameterSettingClient],
})
export class ParameterSettingModule {}
