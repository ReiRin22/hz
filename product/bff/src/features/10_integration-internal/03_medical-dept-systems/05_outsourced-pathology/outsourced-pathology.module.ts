import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OutsourcedPathologyController } from './outsourced-pathology.controller';
import { OutsourcedPathologyService } from './outsourced-pathology.service';
import { OutsourcedPathologyClient } from './outsourced-pathology.client';

@Module({
  imports: [HttpModule],
  controllers: [OutsourcedPathologyController],
  providers: [OutsourcedPathologyService, OutsourcedPathologyClient],
})
export class OutsourcedPathologyModule {}
