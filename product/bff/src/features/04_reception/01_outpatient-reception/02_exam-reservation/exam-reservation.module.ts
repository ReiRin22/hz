import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ExamReservationController } from './exam-reservation.controller';
import { ExamReservationService } from './exam-reservation.service';
import { ExamReservationClient } from './exam-reservation.client';

@Module({
  imports: [HttpModule],
  controllers: [ExamReservationController],
  providers: [ExamReservationService, ExamReservationClient],
})
export class ExamReservationModule {}
