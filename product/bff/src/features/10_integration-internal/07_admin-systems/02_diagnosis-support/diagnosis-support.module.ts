import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DiagnosisSupportController } from './diagnosis-support.controller';
import { DiagnosisSupportService } from './diagnosis-support.service';
import { DiagnosisSupportClient } from './diagnosis-support.client';

@Module({
  imports: [HttpModule],
  controllers: [DiagnosisSupportController],
  providers: [DiagnosisSupportService, DiagnosisSupportClient],
})
export class DiagnosisSupportModule {}
