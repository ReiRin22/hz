import { Injectable } from '@nestjs/common';
import { WorksheetInputClient } from './worksheet-input.client';

@Injectable()
export class WorksheetInputService {
  constructor(private readonly worksheetInputClient: WorksheetInputClient) {}

  // TODO: ビジネスロジックを実装
}
