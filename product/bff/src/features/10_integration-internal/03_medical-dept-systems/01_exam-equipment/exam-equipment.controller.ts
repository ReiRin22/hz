import { Controller } from '@nestjs/common';
import { ExamEquipmentService } from './exam-equipment.service';

@Controller('exam-equipment')
export class ExamEquipmentController {
  constructor(private readonly examEquipmentService: ExamEquipmentService) {}

  // TODO: エンドポイントを実装
}
