import { Controller } from '@nestjs/common';
import { CareSystemService } from './care-system.service';

@Controller('care-system')
export class CareSystemController {
  constructor(private readonly careSystemService: CareSystemService) {}

  // TODO: エンドポイントを実装
}
