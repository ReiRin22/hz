import { Injectable } from '@nestjs/common';
import { OutpatientJournalClient } from './outpatient-journal.client';

@Injectable()
export class OutpatientJournalService {
  constructor(private readonly outpatientJournalClient: OutpatientJournalClient) {}

  // TODO: ビジネスロジックを実装
}
