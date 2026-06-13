import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DiseaseRegistrationController } from './disease-registration.controller';
import { DiseaseRegistrationService } from './disease-registration.service';
import { DiseaseRegistrationClient } from './disease-registration.client';

@Module({
  imports: [HttpModule],
  controllers: [DiseaseRegistrationController],
  providers: [DiseaseRegistrationService, DiseaseRegistrationClient],
})
export class DiseaseRegistrationModule {}
