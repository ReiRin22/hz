import { Controller } from '@nestjs/common';
import { ResultEntryService } from './result-entry.service';

@Controller('result-entry')
export class ResultEntryController {
  constructor(private readonly resultEntryService: ResultEntryService) {}

  // TODO: エンドポイントを実装
}
