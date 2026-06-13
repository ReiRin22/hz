import { Controller } from '@nestjs/common';
import { MedicalReservationService } from './medical-reservation.service';

@Controller('medical-reservation')
export class MedicalReservationController {
  constructor(private readonly medicalReservationService: MedicalReservationService) {}

  // TODO: エンドポイントを実装
}
