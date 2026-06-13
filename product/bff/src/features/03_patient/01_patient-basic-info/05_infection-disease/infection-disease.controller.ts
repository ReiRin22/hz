import { Controller } from '@nestjs/common';
import { InfectionDiseaseService } from './infection-disease.service';

@Controller('infection-disease')
export class InfectionDiseaseController {
  constructor(private readonly infectionDiseaseService: InfectionDiseaseService) {}

  // TODO: エンドポイントを実装
}
