import { Controller } from '@nestjs/common';
import { GeneralOutputService } from './general-output.service';

@Controller('general-output')
export class GeneralOutputController {
  constructor(private readonly generalOutputService: GeneralOutputService) {}

  // TODO: エンドポイントを実装
}
