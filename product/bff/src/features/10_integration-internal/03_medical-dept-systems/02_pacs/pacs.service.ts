import { Injectable } from '@nestjs/common';
import { PacsClient } from './pacs.client';

@Injectable()
export class PacsService {
  constructor(private readonly pacsClient: PacsClient) {}

  // TODO: ビジネスロジックを実装
}
