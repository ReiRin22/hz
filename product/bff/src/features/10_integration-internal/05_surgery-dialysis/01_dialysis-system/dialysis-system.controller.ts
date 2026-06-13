import { Controller } from '@nestjs/common';
import { DialysisSystemService } from './dialysis-system.service';

@Controller('dialysis-system')
export class DialysisSystemController {
  constructor(private readonly dialysisSystemService: DialysisSystemService) {}

  // TODO: エンドポイントを実装
}
