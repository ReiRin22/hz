import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TodoClient } from './todo.client';

@Module({
  imports: [HttpModule],
  controllers: [TodoController],
  providers: [TodoService, TodoClient],
})
export class TodoModule {}
