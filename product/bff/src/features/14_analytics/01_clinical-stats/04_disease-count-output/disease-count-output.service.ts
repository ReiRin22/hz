import { Injectable } from '@nestjs/common';
import { DiseaseCountOutputClient } from './disease-count-output.client';

@Injectable()
export class DiseaseCountOutputService {
  constructor(private readonly diseaseCountOutputClient: DiseaseCountOutputClient) {}

  // TODO: ビジネスロジックを実装
}
