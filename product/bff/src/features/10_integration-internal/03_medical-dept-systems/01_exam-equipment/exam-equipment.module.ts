import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ExamEquipmentController } from './exam-equipment.controller';
import { ExamEquipmentService } from './exam-equipment.service';
import { ExamEquipmentClient } from './exam-equipment.client';

@Module({
  imports: [HttpModule],
  controllers: [ExamEquipmentController],
  providers: [ExamEquipmentService, ExamEquipmentClient],
})
export class ExamEquipmentModule {}
