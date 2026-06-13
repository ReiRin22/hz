import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SpecimenSettingController } from './specimen-setting.controller';
import { SpecimenSettingService } from './specimen-setting.service';
import { SpecimenSettingClient } from './specimen-setting.client';

@Module({
  imports: [HttpModule],
  controllers: [SpecimenSettingController],
  providers: [SpecimenSettingService, SpecimenSettingClient],
})
export class SpecimenSettingModule {}
