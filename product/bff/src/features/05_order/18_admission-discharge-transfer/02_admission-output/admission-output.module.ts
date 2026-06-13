import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AdmissionOutputController } from './admission-output.controller';
import { AdmissionOutputService } from './admission-output.service';
import { AdmissionOutputClient } from './admission-output.client';

@Module({
  imports: [HttpModule],
  controllers: [AdmissionOutputController],
  providers: [AdmissionOutputService, AdmissionOutputClient],
})
export class AdmissionOutputModule {}
