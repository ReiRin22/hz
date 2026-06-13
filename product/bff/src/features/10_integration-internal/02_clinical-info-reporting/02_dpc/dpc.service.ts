import { Injectable } from '@nestjs/common';
import { DpcClient } from './dpc.client';

@Injectable()
export class DpcService {
  constructor(private readonly dpcClient: DpcClient) {}

  // TODO: ビジネスロジックを実装
}
