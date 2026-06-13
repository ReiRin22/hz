import { Injectable } from '@nestjs/common';
import { PrintClient } from './print.client';

@Injectable()
export class PrintService {
  constructor(private readonly printClient: PrintClient) {}

  // TODO: ビジネスロジックを実装
}
