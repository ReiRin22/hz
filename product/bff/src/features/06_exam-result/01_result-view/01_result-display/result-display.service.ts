import { Injectable } from '@nestjs/common';
import { ResultDisplayClient } from './result-display.client';

@Injectable()
export class ResultDisplayService {
  constructor(private readonly resultDisplayClient: ResultDisplayClient) {}

  // TODO: ビジネスロジックを実装
}
