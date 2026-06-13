import { Injectable } from '@nestjs/common';
import { TransferOutputClient } from './transfer-output.client';

@Injectable()
export class TransferOutputService {
  constructor(private readonly transferOutputClient: TransferOutputClient) {}

  // TODO: ビジネスロジックを実装
}
