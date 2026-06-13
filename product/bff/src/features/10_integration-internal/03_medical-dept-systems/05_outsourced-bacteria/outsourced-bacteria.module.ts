import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OutsourcedBacteriaController } from './outsourced-bacteria.controller';
import { OutsourcedBacteriaService } from './outsourced-bacteria.service';
import { OutsourcedBacteriaClient } from './outsourced-bacteria.client';

@Module({
  imports: [HttpModule],
  controllers: [OutsourcedBacteriaController],
  providers: [OutsourcedBacteriaService, OutsourcedBacteriaClient],
})
export class OutsourcedBacteriaModule {}
