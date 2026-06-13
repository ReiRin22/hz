import { Controller } from '@nestjs/common';
import { NursingMgmtJournalService } from './nursing-mgmt-journal.service';

@Controller('nursing-mgmt-journal')
export class NursingMgmtJournalController {
  constructor(private readonly nursingMgmtJournalService: NursingMgmtJournalService) {}

  // TODO: エンドポイントを実装
}
