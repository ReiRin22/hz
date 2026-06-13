import { Injectable } from '@nestjs/common';
import { ProblemListClient } from './problem-list.client';

@Injectable()
export class ProblemListService {
  constructor(private readonly problemListClient: ProblemListClient) {}

  // TODO: ビジネスロジックを実装
}
