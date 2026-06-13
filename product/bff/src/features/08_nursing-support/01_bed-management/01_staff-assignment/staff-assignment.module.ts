import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { StaffAssignmentController } from './staff-assignment.controller';
import { StaffAssignmentService } from './staff-assignment.service';
import { StaffAssignmentClient } from './staff-assignment.client';

@Module({
  imports: [HttpModule],
  controllers: [StaffAssignmentController],
  providers: [StaffAssignmentService, StaffAssignmentClient],
})
export class StaffAssignmentModule {}
