import { Injectable } from '@nestjs/common';
import { GuidanceOutputClient } from './guidance-output.client';

@Injectable()
export class GuidanceOutputService {
  constructor(private readonly guidanceOutputClient: GuidanceOutputClient) {}

  // TODO: ビジネスロジックを実装
}
