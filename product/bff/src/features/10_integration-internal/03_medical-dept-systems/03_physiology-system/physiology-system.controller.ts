import { Controller } from '@nestjs/common';
import { PhysiologySystemService } from './physiology-system.service';

@Controller('physiology-system')
export class PhysiologySystemController {
  constructor(private readonly physiologySystemService: PhysiologySystemService) {}

  // TODO: エンドポイントを実装
}
