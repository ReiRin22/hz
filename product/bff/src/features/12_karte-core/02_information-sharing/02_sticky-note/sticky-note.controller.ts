import { Controller } from '@nestjs/common';
import { StickyNoteService } from './sticky-note.service';

@Controller('sticky-note')
export class StickyNoteController {
  constructor(private readonly stickyNoteService: StickyNoteService) {}

  // TODO: エンドポイントを実装
}
