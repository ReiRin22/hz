import { Injectable } from '@nestjs/common';
import { HomeMgmtClient } from './home-mgmt.client';

@Injectable()
export class HomeMgmtService {
  constructor(private readonly homeMgmtClient: HomeMgmtClient) {}

  // TODO: ビジネスロジックを実装
}
