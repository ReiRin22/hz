import { Injectable } from '@nestjs/common';
import { VariousListsClient } from './various-lists.client';

@Injectable()
export class VariousListsService {
  constructor(private readonly variousListsClient: VariousListsClient) {}

  // TODO: ビジネスロジックを実装
}
