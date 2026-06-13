import { Injectable } from '@nestjs/common';
import { ChatClient } from './chat.client';

@Injectable()
export class ChatService {
  constructor(private readonly chatClient: ChatClient) {}

  // TODO: ビジネスロジックを実装
}
