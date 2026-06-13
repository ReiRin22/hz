import { Controller } from '@nestjs/common';
import { SpecificCheckupService } from './specific-checkup.service';

@Controller('specific-checkup')
export class SpecificCheckupController {
  constructor(private readonly specificCheckupService: SpecificCheckupService) {}

  // TODO: エンドポイントを実装
}
