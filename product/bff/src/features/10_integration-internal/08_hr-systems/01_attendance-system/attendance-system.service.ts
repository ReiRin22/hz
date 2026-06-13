import { Injectable } from '@nestjs/common';
import { AttendanceSystemClient } from './attendance-system.client';

@Injectable()
export class AttendanceSystemService {
  constructor(private readonly attendanceSystemClient: AttendanceSystemClient) {}

  // TODO: ビジネスロジックを実装
}
