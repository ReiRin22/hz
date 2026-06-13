import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { EndoscopyOutputController } from './endoscopy-output.controller';
import { EndoscopyOutputService } from './endoscopy-output.service';
import { EndoscopyOutputClient } from './endoscopy-output.client';

@Module({
  imports: [HttpModule],
  controllers: [EndoscopyOutputController],
  providers: [EndoscopyOutputService, EndoscopyOutputClient],
})
export class EndoscopyOutputModule {}
