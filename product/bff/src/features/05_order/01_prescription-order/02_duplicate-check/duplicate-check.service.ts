import { Injectable } from '@nestjs/common';
import { DuplicateCheckClient } from './duplicate-check.client';

@Injectable()
export class DuplicateCheckService {
  constructor(private readonly duplicateCheckClient: DuplicateCheckClient) {}

  // TODO: ビジネスロジックを実装
}
