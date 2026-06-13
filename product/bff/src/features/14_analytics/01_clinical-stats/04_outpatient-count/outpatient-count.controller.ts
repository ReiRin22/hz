import { Controller } from '@nestjs/common';
import { OutpatientCountService } from './outpatient-count.service';

@Controller('outpatient-count')
export class OutpatientCountController {
  constructor(private readonly outpatientCountService: OutpatientCountService) {}

  // TODO: エンドポイントを実装
}
