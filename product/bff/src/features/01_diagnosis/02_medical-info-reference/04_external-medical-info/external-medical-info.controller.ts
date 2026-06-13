import { Controller } from '@nestjs/common';
import { ExternalMedicalInfoService } from './external-medical-info.service';

@Controller('external-medical-info')
export class ExternalMedicalInfoController {
  constructor(private readonly externalMedicalInfoService: ExternalMedicalInfoService) {}

  // TODO: エンドポイントを実装
}
