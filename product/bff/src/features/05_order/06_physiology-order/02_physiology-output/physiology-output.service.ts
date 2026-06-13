import { Injectable } from '@nestjs/common';
import { PhysiologyOutputClient } from './physiology-output.client';

@Injectable()
export class PhysiologyOutputService {
  constructor(private readonly physiologyOutputClient: PhysiologyOutputClient) {}

  // TODO: ビジネスロジックを実装
}
