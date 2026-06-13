import { Controller } from '@nestjs/common';
import { RevisitReceptionService } from './revisit-reception.service';

@Controller('revisit-reception')
export class RevisitReceptionController {
  constructor(private readonly revisitReceptionService: RevisitReceptionService) {}

  // TODO: エンドポイントを実装
}
