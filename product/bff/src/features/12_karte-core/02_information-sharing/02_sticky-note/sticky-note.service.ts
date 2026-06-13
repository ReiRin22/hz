import { Injectable } from '@nestjs/common';
import { StickyNoteClient } from './sticky-note.client';

@Injectable()
export class StickyNoteService {
  constructor(private readonly stickyNoteClient: StickyNoteClient) {}

  // TODO: ビジネスロジックを実装
}
