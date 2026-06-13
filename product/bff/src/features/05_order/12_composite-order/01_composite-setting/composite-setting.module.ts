import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CompositeSettingController } from './composite-setting.controller';
import { CompositeSettingService } from './composite-setting.service';
import { CompositeSettingClient } from './composite-setting.client';

@Module({
  imports: [HttpModule],
  controllers: [CompositeSettingController],
  providers: [CompositeSettingService, CompositeSettingClient],
})
export class CompositeSettingModule {}
