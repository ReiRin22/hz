import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CompositeOutputController } from './composite-output.controller';
import { CompositeOutputService } from './composite-output.service';
import { CompositeOutputClient } from './composite-output.client';

@Module({
  imports: [HttpModule],
  controllers: [CompositeOutputController],
  providers: [CompositeOutputService, CompositeOutputClient],
})
export class CompositeOutputModule {}
