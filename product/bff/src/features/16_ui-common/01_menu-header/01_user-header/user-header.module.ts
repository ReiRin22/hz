import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { UserHeaderController } from './user-header.controller';
import { UserHeaderService } from './user-header.service';
import { UserHeaderClient } from './user-header.client';

@Module({
  imports: [HttpModule],
  controllers: [UserHeaderController],
  providers: [UserHeaderService, UserHeaderClient],
})
export class UserHeaderModule {}
