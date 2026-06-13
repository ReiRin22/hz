import { Injectable } from '@nestjs/common';
import { AuthClient } from './auth.client';

@Injectable()
export class AuthService {
  constructor(private readonly authClient: AuthClient) {}

  // TODO: ビジネスロジックを実装
}
