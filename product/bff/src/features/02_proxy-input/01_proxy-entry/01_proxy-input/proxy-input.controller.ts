import { Controller } from '@nestjs/common';
import { ProxyInputService } from './proxy-input.service';

@Controller('proxy-input')
export class ProxyInputController {
  constructor(private readonly proxyInputService: ProxyInputService) {}

  // TODO: エンドポイントを実装
}
