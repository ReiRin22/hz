import { Controller } from '@nestjs/common';
import { InterfaceMgmtService } from './interface-mgmt.service';

@Controller('interface-mgmt')
export class InterfaceMgmtController {
  constructor(private readonly interfaceMgmtService: InterfaceMgmtService) {}

  // TODO: エンドポイントを実装
}
