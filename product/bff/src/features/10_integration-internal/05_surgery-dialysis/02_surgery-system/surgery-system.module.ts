import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SurgerySystemController } from './surgery-system.controller';
import { SurgerySystemService } from './surgery-system.service';
import { SurgerySystemClient } from './surgery-system.client';

@Module({
  imports: [HttpModule],
  controllers: [SurgerySystemController],
  providers: [SurgerySystemService, SurgerySystemClient],
})
export class SurgerySystemModule {}
