import { Controller } from '@nestjs/common';
import { RehabPrescriptionService } from './rehab-prescription.service';

@Controller('rehab-prescription')
export class RehabPrescriptionController {
  constructor(private readonly rehabPrescriptionService: RehabPrescriptionService) {}

  // TODO: エンドポイントを実装
}
