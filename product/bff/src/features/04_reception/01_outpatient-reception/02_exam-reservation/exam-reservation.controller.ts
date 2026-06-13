import { Controller } from '@nestjs/common';
import { ExamReservationService } from './exam-reservation.service';

@Controller('exam-reservation')
export class ExamReservationController {
  constructor(private readonly examReservationService: ExamReservationService) {}

  // TODO: エンドポイントを実装
}
