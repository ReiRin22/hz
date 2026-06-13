import { Injectable } from '@nestjs/common';
import { ImplantDeviceClient } from './implant-device.client';

@Injectable()
export class ImplantDeviceService {
  constructor(private readonly implantDeviceClient: ImplantDeviceClient) {}

  // TODO: ビジネスロジックを実装
}
