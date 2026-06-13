import { Injectable } from '@nestjs/common';
import { EndoscopySystemClient } from './endoscopy-system.client';

@Injectable()
export class EndoscopySystemService {
  constructor(private readonly endoscopySystemClient: EndoscopySystemClient) {}

  // TODO: ビジネスロジックを実装
}
