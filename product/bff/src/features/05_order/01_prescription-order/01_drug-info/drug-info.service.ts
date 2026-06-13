import { Injectable } from '@nestjs/common';
import { DrugInfoClient } from './drug-info.client';

@Injectable()
export class DrugInfoService {
  constructor(private readonly drugInfoClient: DrugInfoClient) {}

  // TODO: ビジネスロジックを実装
}
