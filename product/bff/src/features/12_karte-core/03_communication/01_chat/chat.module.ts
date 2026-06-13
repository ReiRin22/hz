import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatClient } from './chat.client';

@Module({
  imports: [HttpModule],
  controllers: [ChatController],
  providers: [ChatService, ChatClient],
})
export class ChatModule {}
