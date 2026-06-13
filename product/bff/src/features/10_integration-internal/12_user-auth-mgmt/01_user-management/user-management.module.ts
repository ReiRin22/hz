import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UserManagementController } from './user-management.controller';
import { UserManagementService } from './user-management.service';
import { UserManagementClient } from './user-management.client';

@Module({
  imports: [HttpModule],
  controllers: [UserManagementController],
  providers: [UserManagementService, UserManagementClient],
})
export class UserManagementModule {}
