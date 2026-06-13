import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DiseaseClassificationController } from './disease-classification.controller';
import { DiseaseClassificationService } from './disease-classification.service';
import { DiseaseClassificationClient } from './disease-classification.client';

@Module({
  imports: [HttpModule],
  controllers: [DiseaseClassificationController],
  providers: [DiseaseClassificationService, DiseaseClassificationClient],
})
export class DiseaseClassificationModule {}
