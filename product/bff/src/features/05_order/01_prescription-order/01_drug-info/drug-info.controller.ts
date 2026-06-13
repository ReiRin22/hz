import { Controller } from '@nestjs/common';
import { DrugInfoService } from './drug-info.service';

@Controller('drug-info')
export class DrugInfoController {
  constructor(private readonly drugInfoService: DrugInfoService) {}

  // TODO: エンドポイントを実装
}
