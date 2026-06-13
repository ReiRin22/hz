import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TreatmentSettingController } from './treatment-setting.controller';
import { TreatmentSettingService } from './treatment-setting.service';
import { TreatmentSettingClient } from './treatment-setting.client';

@Module({
  imports: [HttpModule],
  controllers: [TreatmentSettingController],
  providers: [TreatmentSettingService, TreatmentSettingClient],
})
export class TreatmentSettingModule {}
