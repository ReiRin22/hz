import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OutsourcedExamController } from './outsourced-exam.controller';
import { OutsourcedExamService } from './outsourced-exam.service';
import { OutsourcedExamClient } from './outsourced-exam.client';

@Module({
  imports: [HttpModule],
  controllers: [OutsourcedExamController],
  providers: [OutsourcedExamService, OutsourcedExamClient],
})
export class OutsourcedExamModule {}
