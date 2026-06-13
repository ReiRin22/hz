import { Controller } from '@nestjs/common';
import { ProxyRejectionService } from './proxy-rejection.service';

@Controller('proxy-rejection')
export class ProxyRejectionController {
  constructor(private readonly proxyRejectionService: ProxyRejectionService) {}

  // TODO: エンドポイントを実装
}
