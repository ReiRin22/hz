import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EndoscopySystemController } from './endoscopy-system.controller';
import { EndoscopySystemService } from './endoscopy-system.service';
import { EndoscopySystemClient } from './endoscopy-system.client';

@Module({
  imports: [HttpModule],
  controllers: [EndoscopySystemController],
  providers: [EndoscopySystemService, EndoscopySystemClient],
})
export class EndoscopySystemModule {}
