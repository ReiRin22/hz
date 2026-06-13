import { Controller } from '@nestjs/common';
import { ResultDisplayService } from './result-display.service';

@Controller('result-display')
export class ResultDisplayController {
  constructor(private readonly resultDisplayService: ResultDisplayService) {}

  // TODO: エンドポイントを実装
}
