import { Injectable } from '@nestjs/common';
import { ErrorControlClient } from './error-control.client';

@Injectable()
export class ErrorControlService {
  constructor(private readonly errorControlClient: ErrorControlClient) {}

  // TODO: ビジネスロジックを実装
}
