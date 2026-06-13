import { Controller } from '@nestjs/common';
import { SsoService } from './sso.service';

@Controller('sso')
export class SsoController {
  constructor(private readonly ssoService: SsoService) {}

  // TODO: エンドポイントを実装
}
