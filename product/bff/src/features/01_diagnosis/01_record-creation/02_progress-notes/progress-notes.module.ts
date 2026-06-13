import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProgressNotesController } from './progress-notes.controller';
import { ProgressNotesService } from './progress-notes.service';
import { ProgressNotesClient } from './progress-notes.client';

@Module({
  imports: [HttpModule],
  controllers: [ProgressNotesController],
  providers: [ProgressNotesService, ProgressNotesClient],
})
export class ProgressNotesModule {}
