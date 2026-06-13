import { Controller } from '@nestjs/common';
import { ChartReferenceService } from './chart-reference.service';

@Controller('chart-reference')
export class ChartReferenceController {
  constructor(private readonly chartReferenceService: ChartReferenceService) {}

  // TODO: エンドポイントを実装
}
