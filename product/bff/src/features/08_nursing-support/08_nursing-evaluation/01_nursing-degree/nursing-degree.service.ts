import { Injectable } from '@nestjs/common';
import { NursingDegreeClient } from './nursing-degree.client';

@Injectable()
export class NursingDegreeService {
  constructor(private readonly nursingDegreeClient: NursingDegreeClient) {}

  // TODO: ビジネスロジックを実装
}
