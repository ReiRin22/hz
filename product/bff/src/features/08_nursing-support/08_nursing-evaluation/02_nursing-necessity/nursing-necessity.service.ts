import { Injectable } from '@nestjs/common';
import { NursingNecessityClient } from './nursing-necessity.client';

@Injectable()
export class NursingNecessityService {
  constructor(private readonly nursingNecessityClient: NursingNecessityClient) {}

  // TODO: ビジネスロジックを実装
}
