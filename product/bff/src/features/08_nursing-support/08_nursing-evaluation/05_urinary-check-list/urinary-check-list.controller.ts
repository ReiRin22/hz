import { Controller } from '@nestjs/common';
import { UrinaryCheckListService } from './urinary-check-list.service';

@Controller('urinary-check-list')
export class UrinaryCheckListController {
  constructor(private readonly urinaryCheckListService: UrinaryCheckListService) {}

  // TODO: エンドポイントを実装
}
