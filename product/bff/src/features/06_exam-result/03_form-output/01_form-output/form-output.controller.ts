import { Controller } from '@nestjs/common';
import { FormOutputService } from './form-output.service';

@Controller('form-output')
export class FormOutputController {
  constructor(private readonly formOutputService: FormOutputService) {}

  // TODO: エンドポイントを実装
}
