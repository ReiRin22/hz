import { Module } from '@nestjs/common';
import {
  ExaminationEquipmentController,
  ExaminationReservationsController,
  PatientExaminationReservationsController,
} from './examination-reservations.controller';
import { ExaminationReservationsService } from './examination-reservations.service';
import { ExaminationReservationsClient } from './examination-reservations.client';

@Module({
  controllers: [
    ExaminationReservationsController,
    ExaminationEquipmentController,
    PatientExaminationReservationsController,
  ],
  providers: [ExaminationReservationsService, ExaminationReservationsClient],
})
export class ExaminationReservationsModule {}
