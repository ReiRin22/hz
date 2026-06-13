import { Controller } from '@nestjs/common';
import { Form1InpatientService } from './form1-inpatient.service';

@Controller('form1-inpatient')
export class Form1InpatientController {
  constructor(private readonly form1InpatientService: Form1InpatientService) {}

  // TODO: エンドポイントを実装
}
