import { Injectable } from '@nestjs/common';
import { RevisitReceptionClient } from './revisit-reception.client';

@Injectable()
export class RevisitReceptionService {
  constructor(private readonly revisitReceptionClient: RevisitReceptionClient) {}

  // TODO: ビジネスロジックを実装
}
