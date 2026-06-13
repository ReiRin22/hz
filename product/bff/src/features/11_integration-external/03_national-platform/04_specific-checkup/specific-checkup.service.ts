import { Injectable } from '@nestjs/common';
import { SpecificCheckupClient } from './specific-checkup.client';

@Injectable()
export class SpecificCheckupService {
  constructor(private readonly specificCheckupClient: SpecificCheckupClient) {}

  // TODO: ビジネスロジックを実装
}
