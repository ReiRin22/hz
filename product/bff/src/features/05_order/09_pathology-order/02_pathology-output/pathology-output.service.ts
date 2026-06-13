import { Injectable } from '@nestjs/common';
import { PathologyOutputClient } from './pathology-output.client';

@Injectable()
export class PathologyOutputService {
  constructor(private readonly pathologyOutputClient: PathologyOutputClient) {}

  // TODO: ビジネスロジックを実装
}
