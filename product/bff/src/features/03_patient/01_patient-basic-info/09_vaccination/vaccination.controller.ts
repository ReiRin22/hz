import { Controller } from '@nestjs/common';
import { VaccinationService } from './vaccination.service';

@Controller('vaccination')
export class VaccinationController {
  constructor(private readonly vaccinationService: VaccinationService) {}

  // TODO: エンドポイントを実装
}
