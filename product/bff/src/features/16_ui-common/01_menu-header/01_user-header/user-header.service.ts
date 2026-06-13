import { Injectable } from '@nestjs/common';
import { UserHeaderClient } from './user-header.client';

@Injectable()
export class UserHeaderService {
  constructor(private readonly userHeaderClient: UserHeaderClient) {}

  // TODO: ビジネスロジックを実装
}
