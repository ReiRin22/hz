import { Injectable } from '@nestjs/common';
import { DocumentCreationClient } from './document-creation.client';

@Injectable()
export class DocumentCreationService {
  constructor(private readonly documentCreationClient: DocumentCreationClient) {}

  // TODO: ビジネスロジックを実装
}
