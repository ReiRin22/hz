import { Injectable } from '@nestjs/common';
import { AllergyHistoryClient } from './allergy-history.client';

@Injectable()
export class AllergyHistoryService {
  constructor(private readonly allergyHistoryClient: AllergyHistoryClient) {}

  // TODO: ビジネスロジックを実装
}
