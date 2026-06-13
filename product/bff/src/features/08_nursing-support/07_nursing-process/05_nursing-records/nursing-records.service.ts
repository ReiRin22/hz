import { Injectable } from '@nestjs/common';
import { NursingRecordsClient } from './nursing-records.client';

@Injectable()
export class NursingRecordsService {
  constructor(private readonly nursingRecordsClient: NursingRecordsClient) {}

  // TODO: ビジネスロジックを実装
}
