import { Injectable } from '@nestjs/common';
import { NursingEvaluationClient } from './nursing-evaluation.client';

@Injectable()
export class NursingEvaluationService {
  constructor(private readonly nursingEvaluationClient: NursingEvaluationClient) {}

  // TODO: ビジネスロジックを実装
}
