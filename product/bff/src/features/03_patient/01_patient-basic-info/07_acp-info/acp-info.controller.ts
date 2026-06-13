import { Controller } from '@nestjs/common';
import { AcpInfoService } from './acp-info.service';

@Controller('acp-info')
export class AcpInfoController {
  constructor(private readonly acpInfoService: AcpInfoService) {}

  // TODO: エンドポイントを実装
}
