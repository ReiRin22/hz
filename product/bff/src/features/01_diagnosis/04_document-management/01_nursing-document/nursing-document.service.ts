import { Injectable } from '@nestjs/common';
import { NursingDocumentClient } from './nursing-document.client';

@Injectable()
export class NursingDocumentService {
  constructor(private readonly nursingDocumentClient: NursingDocumentClient) {}

  // TODO: ビジネスロジックを実装
}
