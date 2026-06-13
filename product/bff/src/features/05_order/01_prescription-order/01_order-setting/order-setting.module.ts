import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OrderSettingController } from './order-setting.controller';
import { OrderSettingService } from './order-setting.service';
import { OrderSettingClient } from './order-setting.client';

@Module({
  imports: [HttpModule],
  controllers: [OrderSettingController],
  providers: [OrderSettingService, OrderSettingClient],
})
export class OrderSettingModule {}
