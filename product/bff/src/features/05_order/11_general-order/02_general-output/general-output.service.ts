import { Injectable } from '@nestjs/common';
import { GeneralOutputClient } from './general-output.client';

@Injectable()
export class GeneralOutputService {
  constructor(private readonly generalOutputClient: GeneralOutputClient) {}

  // TODO: ビジネスロジックを実装
}
