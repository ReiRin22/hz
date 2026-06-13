import { Controller } from '@nestjs/common';
import { DiseaseRegistrationService } from './disease-registration.service';

@Controller('disease-registration')
export class DiseaseRegistrationController {
  constructor(private readonly diseaseRegistrationService: DiseaseRegistrationService) {}

  // TODO: エンドポイントを実装
}
