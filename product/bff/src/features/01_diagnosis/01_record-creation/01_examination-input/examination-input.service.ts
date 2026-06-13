import { Injectable } from '@nestjs/common';
import { ExaminationInputClient } from './examination-input.client';

@Injectable()
export class ExaminationInputService {
  constructor(private readonly examinationInputClient: ExaminationInputClient) {}

  // TODO: ビジネスロジックを実装
}
