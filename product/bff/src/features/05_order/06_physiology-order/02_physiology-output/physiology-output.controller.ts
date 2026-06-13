import { Controller } from '@nestjs/common';
import { PhysiologyOutputService } from './physiology-output.service';

@Controller('physiology-output')
export class PhysiologyOutputController {
  constructor(private readonly physiologyOutputService: PhysiologyOutputService) {}

  // TODO: エンドポイントを実装
}
