import { Injectable } from '@nestjs/common';
import { BacteriaOutputClient } from './bacteria-output.client';

@Injectable()
export class BacteriaOutputService {
  constructor(private readonly bacteriaOutputClient: BacteriaOutputClient) {}

  // TODO: ビジネスロジックを実装
}
