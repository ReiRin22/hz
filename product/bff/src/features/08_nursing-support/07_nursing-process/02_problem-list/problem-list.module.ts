import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProblemListController } from './problem-list.controller';
import { ProblemListService } from './problem-list.service';
import { ProblemListClient } from './problem-list.client';

@Module({
  imports: [HttpModule],
  controllers: [ProblemListController],
  providers: [ProblemListService, ProblemListClient],
})
export class ProblemListModule {}
