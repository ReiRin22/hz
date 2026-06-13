import { Injectable } from '@nestjs/common';
import { NurseCallClient } from './nurse-call.client';

@Injectable()
export class NurseCallService {
  constructor(private readonly nurseCallClient: NurseCallClient) {}

  // TODO: ビジネスロジックを実装
}
