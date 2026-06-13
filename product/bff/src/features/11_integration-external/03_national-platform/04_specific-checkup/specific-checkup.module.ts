import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SpecificCheckupController } from './specific-checkup.controller';
import { SpecificCheckupService } from './specific-checkup.service';
import { SpecificCheckupClient } from './specific-checkup.client';

@Module({
  imports: [HttpModule],
  controllers: [SpecificCheckupController],
  providers: [SpecificCheckupService, SpecificCheckupClient],
})
export class SpecificCheckupModule {}
