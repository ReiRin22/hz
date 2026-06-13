import { Injectable } from '@nestjs/common';
import { ShiftSystemClient } from './shift-system.client';

@Injectable()
export class ShiftSystemService {
  constructor(private readonly shiftSystemClient: ShiftSystemClient) {}

  // TODO: ビジネスロジックを実装
}
