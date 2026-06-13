import { Injectable } from '@nestjs/common';
import { InfectionDiseaseClient } from './infection-disease.client';

@Injectable()
export class InfectionDiseaseService {
  constructor(private readonly infectionDiseaseClient: InfectionDiseaseClient) {}

  // TODO: ビジネスロジックを実装
}
