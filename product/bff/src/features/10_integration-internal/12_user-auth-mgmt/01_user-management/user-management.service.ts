import { Injectable } from '@nestjs/common';
import { UserManagementClient } from './user-management.client';

@Injectable()
export class UserManagementService {
  constructor(private readonly userManagementClient: UserManagementClient) {}

  // TODO: ビジネスロジックを実装
}
