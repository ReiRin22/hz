import { Injectable } from '@nestjs/common';
import { ExamEquipmentClient } from './exam-equipment.client';

@Injectable()
export class ExamEquipmentService {
  constructor(private readonly examEquipmentClient: ExamEquipmentClient) {}

  // TODO: ビジネスロジックを実装
}
