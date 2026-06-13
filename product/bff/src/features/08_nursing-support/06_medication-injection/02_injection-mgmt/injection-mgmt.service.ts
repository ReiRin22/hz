import { Injectable } from '@nestjs/common';
import { InjectionMgmtClient } from './injection-mgmt.client';

@Injectable()
export class InjectionMgmtService {
  constructor(private readonly injectionMgmtClient: InjectionMgmtClient) {}

  // TODO: ビジネスロジックを実装
}
