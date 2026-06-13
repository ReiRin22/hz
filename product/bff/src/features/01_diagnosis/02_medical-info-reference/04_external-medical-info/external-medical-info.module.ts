import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ExternalMedicalInfoController } from './external-medical-info.controller';
import { ExternalMedicalInfoService } from './external-medical-info.service';
import { ExternalMedicalInfoClient } from './external-medical-info.client';

@Module({
  imports: [HttpModule],
  controllers: [ExternalMedicalInfoController],
  providers: [ExternalMedicalInfoService, ExternalMedicalInfoClient],
})
export class ExternalMedicalInfoModule {}
