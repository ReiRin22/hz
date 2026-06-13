import { Injectable } from '@nestjs/common';
import { MemoClient } from './memo.client';

@Injectable()
export class MemoService {
  constructor(private readonly memoClient: MemoClient) {}

  // TODO: ビジネスロジックを実装
}
