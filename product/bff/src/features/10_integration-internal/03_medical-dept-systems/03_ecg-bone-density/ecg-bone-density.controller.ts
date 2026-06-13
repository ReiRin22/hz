import { Controller } from '@nestjs/common';
import { EcgBoneDensityService } from './ecg-bone-density.service';

@Controller('ecg-bone-density')
export class EcgBoneDensityController {
  constructor(private readonly ecgBoneDensityService: EcgBoneDensityService) {}

  // TODO: エンドポイントを実装
}
