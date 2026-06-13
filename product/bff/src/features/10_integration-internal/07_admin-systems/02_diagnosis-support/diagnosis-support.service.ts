import { Injectable } from '@nestjs/common';
import { DiagnosisSupportClient } from './diagnosis-support.client';

@Injectable()
export class DiagnosisSupportService {
  constructor(private readonly diagnosisSupportClient: DiagnosisSupportClient) {}

  // TODO: ビジネスロジックを実装
}
