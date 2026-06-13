import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EcgBoneDensityController } from './ecg-bone-density.controller';
import { EcgBoneDensityService } from './ecg-bone-density.service';
import { EcgBoneDensityClient } from './ecg-bone-density.client';

@Module({
  imports: [HttpModule],
  controllers: [EcgBoneDensityController],
  providers: [EcgBoneDensityService, EcgBoneDensityClient],
})
export class EcgBoneDensityModule {}
