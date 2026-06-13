import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NursingNecessityController } from './nursing-necessity.controller';
import { NursingNecessityService } from './nursing-necessity.service';
import { NursingNecessityClient } from './nursing-necessity.client';

@Module({
  imports: [HttpModule],
  controllers: [NursingNecessityController],
  providers: [NursingNecessityService, NursingNecessityClient],
})
export class NursingNecessityModule {}
