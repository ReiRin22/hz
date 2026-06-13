import { Injectable } from '@nestjs/common';
import { SurgerySystemClient } from './surgery-system.client';

@Injectable()
export class SurgerySystemService {
  constructor(private readonly surgerySystemClient: SurgerySystemClient) {}

  // TODO: ビジネスロジックを実装
}
