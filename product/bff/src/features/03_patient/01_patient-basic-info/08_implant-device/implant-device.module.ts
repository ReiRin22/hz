import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ImplantDeviceController } from './implant-device.controller';
import { ImplantDeviceService } from './implant-device.service';
import { ImplantDeviceClient } from './implant-device.client';

@Module({
  imports: [HttpModule],
  controllers: [ImplantDeviceController],
  providers: [ImplantDeviceService, ImplantDeviceClient],
})
export class ImplantDeviceModule {}
