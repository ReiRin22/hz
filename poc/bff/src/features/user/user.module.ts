import { Module } from '@nestjs/common';
import { UserController } from '@/features/user/user.controller';
import { UserService } from '@/features/user/user.service';
import { UserClient } from '@/features/user/user.client';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    UserClient
  ],

})
export class UserModule {}