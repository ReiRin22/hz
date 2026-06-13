import { Injectable } from '@nestjs/common';
import { DiseaseRegistrationClient } from './disease-registration.client';

@Injectable()
export class DiseaseRegistrationService {
  constructor(private readonly diseaseRegistrationClient: DiseaseRegistrationClient) {}

  // TODO: ビジネスロジックを実装
}
