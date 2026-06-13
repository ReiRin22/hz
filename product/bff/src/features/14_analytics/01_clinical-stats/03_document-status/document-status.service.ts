import { Injectable } from '@nestjs/common';
import { DocumentStatusClient } from './document-status.client';

@Injectable()
export class DocumentStatusService {
  constructor(private readonly documentStatusClient: DocumentStatusClient) {}

  // TODO: ビジネスロジックを実装
}
