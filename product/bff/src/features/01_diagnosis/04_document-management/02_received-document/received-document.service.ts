import { Injectable } from '@nestjs/common';
import { ReceivedDocumentClient } from './received-document.client';

@Injectable()
export class ReceivedDocumentService {
  constructor(private readonly receivedDocumentClient: ReceivedDocumentClient) {}

  // TODO: ビジネスロジックを実装
}
