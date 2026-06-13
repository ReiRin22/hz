import { Controller } from '@nestjs/common';
import { DiseaseClassificationService } from './disease-classification.service';

@Controller('disease-classification')
export class DiseaseClassificationController {
  constructor(private readonly diseaseClassificationService: DiseaseClassificationService) {}

  // TODO: エンドポイントを実装
}
