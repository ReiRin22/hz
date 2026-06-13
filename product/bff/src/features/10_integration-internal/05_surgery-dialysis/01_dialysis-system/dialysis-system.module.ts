import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DialysisSystemController } from './dialysis-system.controller';
import { DialysisSystemService } from './dialysis-system.service';
import { DialysisSystemClient } from './dialysis-system.client';

@Module({
  imports: [HttpModule],
  controllers: [DialysisSystemController],
  providers: [DialysisSystemService, DialysisSystemClient],
})
export class DialysisSystemModule {}
