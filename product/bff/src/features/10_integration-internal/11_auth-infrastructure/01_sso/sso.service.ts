import { Injectable } from '@nestjs/common';
import { SsoClient } from './sso.client';

@Injectable()
export class SsoService {
  constructor(private readonly ssoClient: SsoClient) {}

  // TODO: ビジネスロジックを実装
}
