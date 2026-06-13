import { Controller } from '@nestjs/common';
import { WorksheetInputService } from './worksheet-input.service';

@Controller('worksheet-input')
export class WorksheetInputController {
  constructor(private readonly worksheetInputService: WorksheetInputService) {}

  // TODO: エンドポイントを実装
}
