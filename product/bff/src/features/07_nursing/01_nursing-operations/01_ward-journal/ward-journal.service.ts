import { Injectable } from '@nestjs/common';
import { WardJournalClient } from './ward-journal.client';

@Injectable()
export class WardJournalService {
  constructor(private readonly wardJournalClient: WardJournalClient) {}

  // TODO: ビジネスロジックを実装
}
