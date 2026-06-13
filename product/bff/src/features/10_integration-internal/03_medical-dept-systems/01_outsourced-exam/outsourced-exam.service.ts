import { Injectable } from '@nestjs/common';
import { OutsourcedExamClient } from './outsourced-exam.client';

@Injectable()
export class OutsourcedExamService {
  constructor(private readonly outsourcedExamClient: OutsourcedExamClient) {}

  // TODO: ビジネスロジックを実装
}
