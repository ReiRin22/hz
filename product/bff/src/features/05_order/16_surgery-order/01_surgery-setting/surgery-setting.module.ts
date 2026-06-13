import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SurgerySettingController } from './surgery-setting.controller';
import { SurgerySettingService } from './surgery-setting.service';
import { SurgerySettingClient } from './surgery-setting.client';

@Module({
  imports: [HttpModule],
  controllers: [SurgerySettingController],
  providers: [SurgerySettingService, SurgerySettingClient],
})
export class SurgerySettingModule {}
