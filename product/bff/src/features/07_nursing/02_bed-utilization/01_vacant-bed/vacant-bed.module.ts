import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { VacantBedController } from './vacant-bed.controller';
import { VacantBedService } from './vacant-bed.service';
import { VacantBedClient } from './vacant-bed.client';

@Module({
  imports: [HttpModule],
  controllers: [VacantBedController],
  providers: [VacantBedService, VacantBedClient],
})
export class VacantBedModule {}
