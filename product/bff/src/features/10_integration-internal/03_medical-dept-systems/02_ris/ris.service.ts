import { Injectable } from '@nestjs/common';
import { RisClient } from './ris.client';

@Injectable()
export class RisService {
  constructor(private readonly risClient: RisClient) {}

  // TODO: ビジネスロジックを実装
}
