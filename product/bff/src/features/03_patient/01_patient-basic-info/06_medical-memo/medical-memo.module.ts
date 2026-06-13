import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MedicalMemoController } from './medical-memo.controller';
import { MedicalMemoService } from './medical-memo.service';
import { MedicalMemoClient } from './medical-memo.client';

@Module({
  imports: [HttpModule],
  controllers: [MedicalMemoController],
  providers: [MedicalMemoService, MedicalMemoClient],
})
export class MedicalMemoModule {}
