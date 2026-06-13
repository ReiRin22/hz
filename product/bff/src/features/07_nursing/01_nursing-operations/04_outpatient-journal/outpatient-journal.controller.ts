import { Controller } from '@nestjs/common';
import { OutpatientJournalService } from './outpatient-journal.service';

@Controller('outpatient-journal')
export class OutpatientJournalController {
  constructor(private readonly outpatientJournalService: OutpatientJournalService) {}

  // TODO: エンドポイントを実装
}
