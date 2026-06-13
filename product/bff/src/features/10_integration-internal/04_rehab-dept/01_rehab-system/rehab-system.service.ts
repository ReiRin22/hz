import { Injectable } from '@nestjs/common';
import { RehabSystemClient } from './rehab-system.client';

@Injectable()
export class RehabSystemService {
  constructor(private readonly rehabSystemClient: RehabSystemClient) {}

  // TODO: ビジネスロジックを実装
}
