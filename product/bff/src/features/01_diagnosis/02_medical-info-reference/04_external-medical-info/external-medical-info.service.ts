import { Injectable } from '@nestjs/common';
import { ExternalMedicalInfoClient } from './external-medical-info.client';

@Injectable()
export class ExternalMedicalInfoService {
  constructor(private readonly externalMedicalInfoClient: ExternalMedicalInfoClient) {}

  // TODO: ビジネスロジックを実装
}
