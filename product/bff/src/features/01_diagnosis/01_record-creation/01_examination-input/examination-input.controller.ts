import { Controller } from '@nestjs/common';
import { ExaminationInputService } from './examination-input.service';

@Controller('examination-input')
export class ExaminationInputController {
  constructor(private readonly examinationInputService: ExaminationInputService) {}

  // TODO: エンドポイントを実装
}
