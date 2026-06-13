import { Injectable } from '@nestjs/common';
import { AcpInfoClient } from './acp-info.client';

@Injectable()
export class AcpInfoService {
  constructor(private readonly acpInfoClient: AcpInfoClient) {}

  // TODO: ビジネスロジックを実装
}
