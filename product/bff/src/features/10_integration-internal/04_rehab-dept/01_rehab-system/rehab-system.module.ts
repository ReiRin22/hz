import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RehabSystemController } from './rehab-system.controller';
import { RehabSystemService } from './rehab-system.service';
import { RehabSystemClient } from './rehab-system.client';

@Module({
  imports: [HttpModule],
  controllers: [RehabSystemController],
  providers: [RehabSystemService, RehabSystemClient],
})
export class RehabSystemModule {}
