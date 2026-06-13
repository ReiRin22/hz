import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SpecimenSystemController } from './specimen-system.controller';
import { SpecimenSystemService } from './specimen-system.service';
import { SpecimenSystemClient } from './specimen-system.client';

@Module({
  imports: [HttpModule],
  controllers: [SpecimenSystemController],
  providers: [SpecimenSystemService, SpecimenSystemClient],
})
export class SpecimenSystemModule {}
