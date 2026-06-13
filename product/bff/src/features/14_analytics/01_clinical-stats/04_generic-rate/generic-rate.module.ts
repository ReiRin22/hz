import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { GenericRateController } from './generic-rate.controller';
import { GenericRateService } from './generic-rate.service';
import { GenericRateClient } from './generic-rate.client';

@Module({
  imports: [HttpModule],
  controllers: [GenericRateController],
  providers: [GenericRateService, GenericRateClient],
})
export class GenericRateModule {}
