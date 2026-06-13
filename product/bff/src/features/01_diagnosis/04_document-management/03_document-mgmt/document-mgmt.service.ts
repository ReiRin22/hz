import { Injectable } from '@nestjs/common';
import { DocumentMgmtClient } from './document-mgmt.client';

@Injectable()
export class DocumentMgmtService {
  constructor(private readonly documentMgmtClient: DocumentMgmtClient) {}

  // TODO: ビジネスロジックを実装
}
