import { Injectable } from '@nestjs/common';
import { DialysisSystemClient } from './dialysis-system.client';

@Injectable()
export class DialysisSystemService {
  constructor(private readonly dialysisSystemClient: DialysisSystemClient) {}

  // TODO: ビジネスロジックを実装
}
