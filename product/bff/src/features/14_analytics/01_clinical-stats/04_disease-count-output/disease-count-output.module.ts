import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DiseaseCountOutputController } from './disease-count-output.controller';
import { DiseaseCountOutputService } from './disease-count-output.service';
import { DiseaseCountOutputClient } from './disease-count-output.client';

@Module({
  imports: [HttpModule],
  controllers: [DiseaseCountOutputController],
  providers: [DiseaseCountOutputService, DiseaseCountOutputClient],
})
export class DiseaseCountOutputModule {}
