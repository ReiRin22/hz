import { Controller } from '@nestjs/common';
import { NursingDiagnosisService } from './nursing-diagnosis.service';

@Controller('nursing-diagnosis')
export class NursingDiagnosisController {
  constructor(private readonly nursingDiagnosisService: NursingDiagnosisService) {}

  // TODO: エンドポイントを実装
}
