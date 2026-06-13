import { Injectable } from '@nestjs/common';
import { InterfaceMgmtClient } from './interface-mgmt.client';

@Injectable()
export class InterfaceMgmtService {
  constructor(private readonly interfaceMgmtClient: InterfaceMgmtClient) {}

  // TODO: ビジネスロジックを実装
}
