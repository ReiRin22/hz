import { Controller } from '@nestjs/common';
import { ImplantDeviceService } from './implant-device.service';

@Controller('implant-device')
export class ImplantDeviceController {
  constructor(private readonly implantDeviceService: ImplantDeviceService) {}

  // TODO: エンドポイントを実装
}
