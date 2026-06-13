import { Controller } from '@nestjs/common';
import { MedicalInfoViewService } from './medical-info-view.service';

@Controller('medical-info-view')
export class MedicalInfoViewController {
  constructor(private readonly medicalInfoViewService: MedicalInfoViewService) {}

  // TODO: エンドポイントを実装
}
