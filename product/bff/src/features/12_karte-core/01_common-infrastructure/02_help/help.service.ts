import { Injectable } from '@nestjs/common';
import { HelpClient } from './help.client';

@Injectable()
export class HelpService {
  constructor(private readonly helpClient: HelpClient) {}

  // TODO: ビジネスロジックを実装
}
