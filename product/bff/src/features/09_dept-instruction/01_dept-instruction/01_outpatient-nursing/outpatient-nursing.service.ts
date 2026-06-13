import { Injectable } from '@nestjs/common';
import { OutpatientNursingClient } from './outpatient-nursing.client';

@Injectable()
export class OutpatientNursingService {
  constructor(private readonly outpatientNursingClient: OutpatientNursingClient) {}

  // TODO: ビジネスロジックを実装
}
