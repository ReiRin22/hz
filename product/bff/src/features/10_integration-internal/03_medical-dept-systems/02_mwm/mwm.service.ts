import { Injectable } from '@nestjs/common';
import { MwmClient } from './mwm.client';

@Injectable()
export class MwmService {
  constructor(private readonly mwmClient: MwmClient) {}

  // TODO: ビジネスロジックを実装
}
