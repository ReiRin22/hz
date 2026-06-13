import { Injectable } from '@nestjs/common';
import { ResultEntryClient } from './result-entry.client';

@Injectable()
export class ResultEntryService {
  constructor(private readonly resultEntryClient: ResultEntryClient) {}

  // TODO: ビジネスロジックを実装
}
