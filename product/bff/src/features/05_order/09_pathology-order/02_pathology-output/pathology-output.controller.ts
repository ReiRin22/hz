import { Controller } from '@nestjs/common';
import { PathologyOutputService } from './pathology-output.service';

@Controller('pathology-output')
export class PathologyOutputController {
  constructor(private readonly pathologyOutputService: PathologyOutputService) {}

  // TODO: エンドポイントを実装
}
