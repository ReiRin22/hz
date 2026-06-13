import { Controller } from '@nestjs/common';
import { InjectionMgmtService } from './injection-mgmt.service';

@Controller('injection-mgmt')
export class InjectionMgmtController {
  constructor(private readonly injectionMgmtService: InjectionMgmtService) {}

  // TODO: エンドポイントを実装
}
