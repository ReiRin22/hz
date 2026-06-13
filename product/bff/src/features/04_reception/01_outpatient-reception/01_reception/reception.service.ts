import { Injectable } from '@nestjs/common';
import { ReceptionClient } from './reception.client';

@Injectable()
export class ReceptionService {
  constructor(private readonly receptionClient: ReceptionClient) {}

  // TODO: ビジネスロジックを実装
}
