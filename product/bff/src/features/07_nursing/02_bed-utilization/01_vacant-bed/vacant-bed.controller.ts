import { Controller } from '@nestjs/common';
import { VacantBedService } from './vacant-bed.service';

@Controller('vacant-bed')
export class VacantBedController {
  constructor(private readonly vacantBedService: VacantBedService) {}

  // TODO: エンドポイントを実装
}
