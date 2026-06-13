import { Injectable } from '@nestjs/common';
import { ChartReferenceClient } from './chart-reference.client';

@Injectable()
export class ChartReferenceService {
  constructor(private readonly chartReferenceClient: ChartReferenceClient) {}

  // TODO: ビジネスロジックを実装
}
