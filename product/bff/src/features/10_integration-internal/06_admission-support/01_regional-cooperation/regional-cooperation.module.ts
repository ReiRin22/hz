import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RegionalCooperationController } from './regional-cooperation.controller';
import { RegionalCooperationService } from './regional-cooperation.service';
import { RegionalCooperationClient } from './regional-cooperation.client';

@Module({
  imports: [HttpModule],
  controllers: [RegionalCooperationController],
  providers: [RegionalCooperationService, RegionalCooperationClient],
})
export class RegionalCooperationModule {}
