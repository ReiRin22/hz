import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { InfectionDiseaseController } from './infection-disease.controller';
import { InfectionDiseaseService } from './infection-disease.service';
import { InfectionDiseaseClient } from './infection-disease.client';

@Module({
  imports: [HttpModule],
  controllers: [InfectionDiseaseController],
  providers: [InfectionDiseaseService, InfectionDiseaseClient],
})
export class InfectionDiseaseModule {}
