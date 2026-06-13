import { Controller } from '@nestjs/common';
import { Form1OutpatientService } from './form1-outpatient.service';

@Controller('form1-outpatient')
export class Form1OutpatientController {
  constructor(private readonly form1OutpatientService: Form1OutpatientService) {}

  // TODO: エンドポイントを実装
}
