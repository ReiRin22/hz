import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SpecimenOutputController } from './specimen-output.controller';
import { SpecimenOutputService } from './specimen-output.service';
import { SpecimenOutputClient } from './specimen-output.client';

@Module({
  imports: [HttpModule],
  controllers: [SpecimenOutputController],
  providers: [SpecimenOutputService, SpecimenOutputClient],
})
export class SpecimenOutputModule {}
