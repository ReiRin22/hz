import { Injectable } from '@nestjs/common';
import { EndoscopyOutputClient } from './endoscopy-output.client';

@Injectable()
export class EndoscopyOutputService {
  constructor(private readonly endoscopyOutputClient: EndoscopyOutputClient) {}

  // TODO: ビジネスロジックを実装
}
