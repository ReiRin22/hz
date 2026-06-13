import { Controller } from '@nestjs/common';
import { PacsService } from './pacs.service';

@Controller('pacs')
export class PacsController {
  constructor(private readonly pacsService: PacsService) {}

  // TODO: エンドポイントを実装
}
