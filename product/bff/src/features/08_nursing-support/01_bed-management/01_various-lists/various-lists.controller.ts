import { Controller } from '@nestjs/common';
import { VariousListsService } from './various-lists.service';

@Controller('various-lists')
export class VariousListsController {
  constructor(private readonly variousListsService: VariousListsService) {}

  // TODO: エンドポイントを実装
}
