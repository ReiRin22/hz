import { Injectable } from '@nestjs/common';
import { ProgressNotesClient } from './progress-notes.client';

@Injectable()
export class ProgressNotesService {
  constructor(private readonly progressNotesClient: ProgressNotesClient) {}

  // TODO: ビジネスロジックを実装
}
