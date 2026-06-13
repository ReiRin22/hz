import { Controller } from '@nestjs/common';
import { TransfusionSystemService } from './transfusion-system.service';

@Controller('transfusion-system')
export class TransfusionSystemController {
  constructor(private readonly transfusionSystemService: TransfusionSystemService) {}

  // TODO: エンドポイントを実装
}
