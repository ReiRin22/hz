import { Controller } from '@nestjs/common';
import { WardJournalService } from './ward-journal.service';

@Controller('ward-journal')
export class WardJournalController {
  constructor(private readonly wardJournalService: WardJournalService) {}

  // TODO: エンドポイントを実装
}
