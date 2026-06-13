import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PressureSoreObservationController } from './pressure-sore-observation.controller';
import { PressureSoreObservationService } from './pressure-sore-observation.service';
import { PressureSoreObservationClient } from './pressure-sore-observation.client';

@Module({
  imports: [HttpModule],
  controllers: [PressureSoreObservationController],
  providers: [PressureSoreObservationService, PressureSoreObservationClient],
})
export class PressureSoreObservationModule {}
