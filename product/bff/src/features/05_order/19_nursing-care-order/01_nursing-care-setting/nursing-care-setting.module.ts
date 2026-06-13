import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NursingCareSettingController } from './nursing-care-setting.controller';
import { NursingCareSettingService } from './nursing-care-setting.service';
import { NursingCareSettingClient } from './nursing-care-setting.client';

@Module({
  imports: [HttpModule],
  controllers: [NursingCareSettingController],
  providers: [NursingCareSettingService, NursingCareSettingClient],
})
export class NursingCareSettingModule {}
