import { Controller } from '@nestjs/common';
import { ProblemListService } from './problem-list.service';

@Controller('problem-list')
export class ProblemListController {
  constructor(private readonly problemListService: ProblemListService) {}

  // TODO: エンドポイントを実装
}
