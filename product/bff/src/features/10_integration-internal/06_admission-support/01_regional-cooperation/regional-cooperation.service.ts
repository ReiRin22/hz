import { Injectable } from '@nestjs/common';
import { RegionalCooperationClient } from './regional-cooperation.client';

@Injectable()
export class RegionalCooperationService {
  constructor(private readonly regionalCooperationClient: RegionalCooperationClient) {}

  // TODO: ビジネスロジックを実装
}
