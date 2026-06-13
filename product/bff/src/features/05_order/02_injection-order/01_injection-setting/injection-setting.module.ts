import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { InjectionSettingController } from './injection-setting.controller';
import { InjectionSettingService } from './injection-setting.service';
import { InjectionSettingClient } from './injection-setting.client';

@Module({
  imports: [HttpModule],
  controllers: [InjectionSettingController],
  providers: [InjectionSettingService, InjectionSettingClient],
})
export class InjectionSettingModule {}
