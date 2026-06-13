import { Controller } from '@nestjs/common';
import { AttendanceSystemService } from './attendance-system.service';

@Controller('attendance-system')
export class AttendanceSystemController {
  constructor(private readonly attendanceSystemService: AttendanceSystemService) {}

  // TODO: エンドポイントを実装
}
