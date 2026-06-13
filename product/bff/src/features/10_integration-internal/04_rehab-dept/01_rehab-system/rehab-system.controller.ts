import { Controller } from '@nestjs/common';
import { RehabSystemService } from './rehab-system.service';

@Controller('rehab-system')
export class RehabSystemController {
  constructor(private readonly rehabSystemService: RehabSystemService) {}

  // TODO: エンドポイントを実装
}
