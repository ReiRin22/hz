import { Injectable } from '@nestjs/common';
import { OutpatientCountClient } from './outpatient-count.client';

@Injectable()
export class OutpatientCountService {
  constructor(private readonly outpatientCountClient: OutpatientCountClient) {}

  // TODO: ビジネスロジックを実装
}
