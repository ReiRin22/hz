import { Injectable } from '@nestjs/common';
import { PhysiologySystemClient } from './physiology-system.client';

@Injectable()
export class PhysiologySystemService {
  constructor(private readonly physiologySystemClient: PhysiologySystemClient) {}

  // TODO: ビジネスロジックを実装
}
