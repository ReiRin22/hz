import { Injectable } from '@nestjs/common';
import { PresenceClient } from './presence.client';

@Injectable()
export class PresenceService {
  constructor(private readonly presenceClient: PresenceClient) {}

  // TODO: ビジネスロジックを実装
}
