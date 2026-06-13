import { Controller } from '@nestjs/common';
import { ContraindicationCheckService } from './contraindication-check.service';

@Controller('contraindication-check')
export class ContraindicationCheckController {
  constructor(private readonly contraindicationCheckService: ContraindicationCheckService) {}

  // TODO: エンドポイントを実装
}
