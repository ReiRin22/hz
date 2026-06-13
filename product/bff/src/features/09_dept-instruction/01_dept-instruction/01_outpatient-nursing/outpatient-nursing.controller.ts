import { Controller } from '@nestjs/common';
import { OutpatientNursingService } from './outpatient-nursing.service';

@Controller('outpatient-nursing')
export class OutpatientNursingController {
  constructor(private readonly outpatientNursingService: OutpatientNursingService) {}

  // TODO: エンドポイントを実装
}
