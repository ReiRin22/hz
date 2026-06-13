import { Injectable } from '@nestjs/common';
import { OutsourcedPathologyClient } from './outsourced-pathology.client';

@Injectable()
export class OutsourcedPathologyService {
  constructor(private readonly outsourcedPathologyClient: OutsourcedPathologyClient) {}

  // TODO: ビジネスロジックを実装
}
