import { Controller } from '@nestjs/common';
import { ProgressNotesService } from './progress-notes.service';

@Controller('progress-notes')
export class ProgressNotesController {
  constructor(private readonly progressNotesService: ProgressNotesService) {}

  // TODO: エンドポイントを実装
}
