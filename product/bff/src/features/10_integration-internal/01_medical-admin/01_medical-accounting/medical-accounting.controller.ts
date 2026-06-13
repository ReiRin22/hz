import { Controller } from '@nestjs/common';
import { MedicalAccountingService } from './medical-accounting.service';

@Controller('medical-accounting')
export class MedicalAccountingController {
  constructor(private readonly medicalAccountingService: MedicalAccountingService) {}

  // TODO: エンドポイントを実装
}
