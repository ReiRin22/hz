import { Injectable } from '@nestjs/common';
import { HospitalJournalClient } from './hospital-journal.client';

@Injectable()
export class HospitalJournalService {
  constructor(private readonly hospitalJournalClient: HospitalJournalClient) {}

  // TODO: ビジネスロジックを実装
}
