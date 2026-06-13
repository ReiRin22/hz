import { Controller } from '@nestjs/common';
import { OutpatientPrescriptionService } from './outpatient-prescription.service';

@Controller('outpatient-prescription')
export class OutpatientPrescriptionController {
  constructor(private readonly outpatientPrescriptionService: OutpatientPrescriptionService) {}

  // TODO: エンドポイントを実装
}
