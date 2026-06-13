import { Injectable } from '@nestjs/common';
import { MoveRegistrationClient } from './move-registration.client';

@Injectable()
export class MoveRegistrationService {
  constructor(private readonly moveRegistrationClient: MoveRegistrationClient) {}

  // TODO: ビジネスロジックを実装
}
