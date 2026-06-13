import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ShiftSystemController } from './shift-system.controller';
import { ShiftSystemService } from './shift-system.service';
import { ShiftSystemClient } from './shift-system.client';

@Module({
  imports: [HttpModule],
  controllers: [ShiftSystemController],
  providers: [ShiftSystemService, ShiftSystemClient],
})
export class ShiftSystemModule {}
