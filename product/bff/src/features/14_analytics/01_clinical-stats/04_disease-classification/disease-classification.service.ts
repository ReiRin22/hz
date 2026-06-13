import { Injectable } from '@nestjs/common';
import { DiseaseClassificationClient } from './disease-classification.client';

@Injectable()
export class DiseaseClassificationService {
  constructor(private readonly diseaseClassificationClient: DiseaseClassificationClient) {}

  // TODO: ビジネスロジックを実装
}
