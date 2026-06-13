import { Injectable } from '@nestjs/common';
import { StaffAssignmentClient } from './staff-assignment.client';

@Injectable()
export class StaffAssignmentService {
  constructor(private readonly staffAssignmentClient: StaffAssignmentClient) {}

  // TODO: ビジネスロジックを実装
}
