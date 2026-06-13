import { Controller } from '@nestjs/common';
import { ReceptionService } from './reception.service';

@Controller('reception')
export class ReceptionController {
  constructor(private readonly receptionService: ReceptionService) {}

  // TODO: エンドポイントを実装
}
