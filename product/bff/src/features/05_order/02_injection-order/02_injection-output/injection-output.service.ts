import { Injectable } from '@nestjs/common';
import { InjectionOutputClient } from './injection-output.client';

@Injectable()
export class InjectionOutputService {
  constructor(private readonly injectionOutputClient: InjectionOutputClient) {}

  // TODO: ビジネスロジックを実装
}
