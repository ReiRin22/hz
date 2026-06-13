import { Injectable } from '@nestjs/common';
import { CompositeOutputClient } from './composite-output.client';

@Injectable()
export class CompositeOutputService {
  constructor(private readonly compositeOutputClient: CompositeOutputClient) {}

  // TODO: ビジネスロジックを実装
}
