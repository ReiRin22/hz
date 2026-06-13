import { Controller } from '@nestjs/common';
import { GenericRateService } from './generic-rate.service';

@Controller('generic-rate')
export class GenericRateController {
  constructor(private readonly genericRateService: GenericRateService) {}

  // TODO: エンドポイントを実装
}
