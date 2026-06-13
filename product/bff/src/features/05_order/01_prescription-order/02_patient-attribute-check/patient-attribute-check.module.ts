import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PatientAttributeCheckController } from './patient-attribute-check.controller';
import { PatientAttributeCheckService } from './patient-attribute-check.service';
import { PatientAttributeCheckClient } from './patient-attribute-check.client';

@Module({
  imports: [HttpModule],
  controllers: [PatientAttributeCheckController],
  providers: [PatientAttributeCheckService, PatientAttributeCheckClient],
})
export class PatientAttributeCheckModule {}
