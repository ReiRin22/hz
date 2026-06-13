import { Controller } from '@nestjs/common';
import { InpatientPrescriptionService } from './inpatient-prescription.service';

@Controller('inpatient-prescription')
export class InpatientPrescriptionController {
  constructor(private readonly inpatientPrescriptionService: InpatientPrescriptionService) {}

  // TODO: エンドポイントを実装
}
