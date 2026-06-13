import { Injectable } from '@nestjs/common';
import { AccessLogClient } from './access-log.client';

@Injectable()
export class AccessLogService {
  constructor(private readonly accessLogClient: AccessLogClient) {}

  // TODO: ビジネスロジックを実装
}
