import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MedicalReservationController } from './medical-reservation.controller';
import { MedicalReservationService } from './medical-reservation.service';
import { MedicalReservationClient } from './medical-reservation.client';

@Module({
  imports: [HttpModule],
  controllers: [MedicalReservationController],
  providers: [MedicalReservationService, MedicalReservationClient],
})
export class MedicalReservationModule {}
