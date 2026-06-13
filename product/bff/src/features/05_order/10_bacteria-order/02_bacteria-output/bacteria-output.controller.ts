import { Controller } from '@nestjs/common';
import { BacteriaOutputService } from './bacteria-output.service';

@Controller('bacteria-output')
export class BacteriaOutputController {
  constructor(private readonly bacteriaOutputService: BacteriaOutputService) {}

  // TODO: エンドポイントを実装
}
