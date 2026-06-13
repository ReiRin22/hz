import { Injectable } from '@nestjs/common';
import { ExamReservationClient } from './exam-reservation.client';

@Injectable()
export class ExamReservationService {
  constructor(private readonly examReservationClient: ExamReservationClient) {}

  // TODO: ビジネスロジックを実装
}
