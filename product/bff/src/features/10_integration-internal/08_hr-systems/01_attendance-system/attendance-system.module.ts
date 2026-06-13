import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AttendanceSystemController } from './attendance-system.controller';
import { AttendanceSystemService } from './attendance-system.service';
import { AttendanceSystemClient } from './attendance-system.client';

@Module({
  imports: [HttpModule],
  controllers: [AttendanceSystemController],
  providers: [AttendanceSystemService, AttendanceSystemClient],
})
export class AttendanceSystemModule {}
