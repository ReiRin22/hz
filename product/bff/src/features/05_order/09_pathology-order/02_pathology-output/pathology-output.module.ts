import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PathologyOutputController } from './pathology-output.controller';
import { PathologyOutputService } from './pathology-output.service';
import { PathologyOutputClient } from './pathology-output.client';

@Module({
  imports: [HttpModule],
  controllers: [PathologyOutputController],
  providers: [PathologyOutputService, PathologyOutputClient],
})
export class PathologyOutputModule {}
