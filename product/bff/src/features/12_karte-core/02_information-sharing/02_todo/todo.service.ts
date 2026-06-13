import { Injectable } from '@nestjs/common';
import { TodoClient } from './todo.client';

@Injectable()
export class TodoService {
  constructor(private readonly todoClient: TodoClient) {}

  // TODO: ビジネスロジックを実装
}
