import { Controller } from '@nestjs/common';
import { DuplicateCheckService } from './duplicate-check.service';

@Controller('duplicate-check')
export class DuplicateCheckController {
  constructor(private readonly duplicateCheckService: DuplicateCheckService) {}

  // TODO: エンドポイントを実装
}
