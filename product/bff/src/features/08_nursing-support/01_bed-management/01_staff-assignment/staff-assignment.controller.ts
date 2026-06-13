import { Controller } from '@nestjs/common';
import { StaffAssignmentService } from './staff-assignment.service';

@Controller('staff-assignment')
export class StaffAssignmentController {
  constructor(private readonly staffAssignmentService: StaffAssignmentService) {}

  // TODO: エンドポイントを実装
}
