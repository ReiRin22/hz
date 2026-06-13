import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ExaminationInputController } from './examination-input.controller';
import { ExaminationInputService } from './examination-input.service';
import { ExaminationInputClient } from './examination-input.client';

@Module({
  imports: [HttpModule],
  controllers: [ExaminationInputController],
  providers: [ExaminationInputService, ExaminationInputClient],
})
export class ExaminationInputModule {}
