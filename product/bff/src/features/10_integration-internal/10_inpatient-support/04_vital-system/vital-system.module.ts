import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { VitalSystemController } from './vital-system.controller';
import { VitalSystemService } from './vital-system.service';
import { VitalSystemClient } from './vital-system.client';

@Module({
  imports: [HttpModule],
  controllers: [VitalSystemController],
  providers: [VitalSystemService, VitalSystemClient],
})
export class VitalSystemModule {}
