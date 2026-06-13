import { Injectable } from '@nestjs/common';
import { OutsourcedBacteriaClient } from './outsourced-bacteria.client';

@Injectable()
export class OutsourcedBacteriaService {
  constructor(private readonly outsourcedBacteriaClient: OutsourcedBacteriaClient) {}

  // TODO: ビジネスロジックを実装
}
