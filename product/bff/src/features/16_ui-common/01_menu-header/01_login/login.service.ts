import { Injectable } from '@nestjs/common';
import { LoginClient } from './login.client';

@Injectable()
export class LoginService {
  constructor(private readonly loginClient: LoginClient) {}

  // TODO: ビジネスロジックを実装
}
