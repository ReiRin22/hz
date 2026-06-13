import { Controller } from '@nestjs/common';
import { WaitTimeAnalysisService } from './wait-time-analysis.service';

@Controller('wait-time-analysis')
export class WaitTimeAnalysisController {
  constructor(private readonly waitTimeAnalysisService: WaitTimeAnalysisService) {}

  // TODO: エンドポイントを実装
}
