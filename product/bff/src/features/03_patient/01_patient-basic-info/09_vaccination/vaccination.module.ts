import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { VaccinationController } from './vaccination.controller';
import { VaccinationService } from './vaccination.service';
import { VaccinationClient } from './vaccination.client';

@Module({
  imports: [HttpModule],
  controllers: [VaccinationController],
  providers: [VaccinationService, VaccinationClient],
})
export class VaccinationModule {}
