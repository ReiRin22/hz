import { Injectable } from '@nestjs/common';
import { ContraindicationCheckClient } from './contraindication-check.client';

@Injectable()
export class ContraindicationCheckService {
  constructor(private readonly contraindicationCheckClient: ContraindicationCheckClient) {}

  // TODO: ビジネスロジックを実装
}
