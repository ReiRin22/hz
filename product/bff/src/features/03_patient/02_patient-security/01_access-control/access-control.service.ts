import { Injectable } from '@nestjs/common';
import { AccessControlClient } from './access-control.client';

@Injectable()
export class AccessControlService {
  constructor(private readonly accessControlClient: AccessControlClient) {}

  // TODO: ビジネスロジックを実装
}
