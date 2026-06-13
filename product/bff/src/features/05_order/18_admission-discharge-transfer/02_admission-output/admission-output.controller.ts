import { Controller } from '@nestjs/common';
import { AdmissionOutputService } from './admission-output.service';

@Controller('admission-output')
export class AdmissionOutputController {
  constructor(private readonly admissionOutputService: AdmissionOutputService) {}

  // TODO: エンドポイントを実装
}
