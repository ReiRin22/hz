import { Controller } from '@nestjs/common';
import { AllergyHistoryService } from './allergy-history.service';

@Controller('allergy-history')
export class AllergyHistoryController {
  constructor(private readonly allergyHistoryService: AllergyHistoryService) {}

  // TODO: エンドポイントを実装
}
