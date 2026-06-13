import { Injectable } from '@nestjs/common';
import { NursingMgmtJournalClient } from './nursing-mgmt-journal.client';

@Injectable()
export class NursingMgmtJournalService {
  constructor(private readonly nursingMgmtJournalClient: NursingMgmtJournalClient) {}

  // TODO: ビジネスロジックを実装
}
