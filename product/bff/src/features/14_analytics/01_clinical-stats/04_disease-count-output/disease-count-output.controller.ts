import { Controller } from '@nestjs/common';
import { DiseaseCountOutputService } from './disease-count-output.service';

@Controller('disease-count-output')
export class DiseaseCountOutputController {
  constructor(private readonly diseaseCountOutputService: DiseaseCountOutputService) {}

  // TODO: エンドポイントを実装
}
