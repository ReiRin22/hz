import { Injectable } from '@nestjs/common';
import { AllergyCheckClient } from './allergy-check.client';

@Injectable()
export class AllergyCheckService {
  constructor(private readonly allergyCheckClient: AllergyCheckClient) {}

  // TODO: ビジネスロジックを実装
}
