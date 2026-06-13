import { Controller } from '@nestjs/common';
import { NursingNecessityService } from './nursing-necessity.service';

@Controller('nursing-necessity')
export class NursingNecessityController {
  constructor(private readonly nursingNecessityService: NursingNecessityService) {}

  // TODO: エンドポイントを実装
}
