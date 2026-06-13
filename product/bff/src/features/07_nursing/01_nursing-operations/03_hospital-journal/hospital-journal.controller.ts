import { Controller } from '@nestjs/common';
import { HospitalJournalService } from './hospital-journal.service';

@Controller('hospital-journal')
export class HospitalJournalController {
  constructor(private readonly hospitalJournalService: HospitalJournalService) {}

  // TODO: エンドポイントを実装
}
