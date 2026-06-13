import { Injectable } from '@nestjs/common';
import { NursingDatabaseClient } from './nursing-database.client';

@Injectable()
export class NursingDatabaseService {
  constructor(private readonly nursingDatabaseClient: NursingDatabaseClient) {}

  // TODO: ビジネスロジックを実装
}
