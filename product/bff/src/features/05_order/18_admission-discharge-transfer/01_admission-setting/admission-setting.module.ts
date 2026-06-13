import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AdmissionSettingController } from './admission-setting.controller';
import { AdmissionSettingService } from './admission-setting.service';
import { AdmissionSettingClient } from './admission-setting.client';

@Module({
  imports: [HttpModule],
  controllers: [AdmissionSettingController],
  providers: [AdmissionSettingService, AdmissionSettingClient],
})
export class AdmissionSettingModule {}
