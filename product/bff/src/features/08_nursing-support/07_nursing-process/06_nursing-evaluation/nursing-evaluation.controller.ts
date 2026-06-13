import { Controller } from '@nestjs/common';
import { NursingEvaluationService } from './nursing-evaluation.service';

@Controller('nursing-evaluation')
export class NursingEvaluationController {
  constructor(private readonly nursingEvaluationService: NursingEvaluationService) {}

  // TODO: エンドポイントを実装
}
