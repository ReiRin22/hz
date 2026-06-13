import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TreatmentOutputController } from './treatment-output.controller';
import { TreatmentOutputService } from './treatment-output.service';
import { TreatmentOutputClient } from './treatment-output.client';

@Module({
  imports: [HttpModule],
  controllers: [TreatmentOutputController],
  providers: [TreatmentOutputService, TreatmentOutputClient],
})
export class TreatmentOutputModule {}
