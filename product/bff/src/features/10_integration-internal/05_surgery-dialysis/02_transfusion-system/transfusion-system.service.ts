import { Injectable } from '@nestjs/common';
import { TransfusionSystemClient } from './transfusion-system.client';

@Injectable()
export class TransfusionSystemService {
  constructor(private readonly transfusionSystemClient: TransfusionSystemClient) {}

  // TODO: ビジネスロジックを実装
}
