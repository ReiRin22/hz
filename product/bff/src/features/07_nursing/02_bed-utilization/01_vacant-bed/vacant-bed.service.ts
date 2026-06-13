import { Injectable } from '@nestjs/common';
import { VacantBedClient } from './vacant-bed.client';

@Injectable()
export class VacantBedService {
  constructor(private readonly vacantBedClient: VacantBedClient) {}

  // TODO: ビジネスロジックを実装
}
