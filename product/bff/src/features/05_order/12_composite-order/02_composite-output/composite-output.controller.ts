import { Controller } from '@nestjs/common';
import { CompositeOutputService } from './composite-output.service';

@Controller('composite-output')
export class CompositeOutputController {
  constructor(private readonly compositeOutputService: CompositeOutputService) {}

  // TODO: エンドポイントを実装
}
