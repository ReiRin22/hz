import { Injectable } from '@nestjs/common';
import { MedicalReservationClient } from './medical-reservation.client';

@Injectable()
export class MedicalReservationService {
  constructor(private readonly medicalReservationClient: MedicalReservationClient) {}

  // TODO: ビジネスロジックを実装
}
