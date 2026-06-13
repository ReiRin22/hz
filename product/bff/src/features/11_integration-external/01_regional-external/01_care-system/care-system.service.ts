import { Injectable } from '@nestjs/common';
import { CareSystemClient } from './care-system.client';

@Injectable()
export class CareSystemService {
  constructor(private readonly careSystemClient: CareSystemClient) {}

  // TODO: ビジネスロジックを実装
}
