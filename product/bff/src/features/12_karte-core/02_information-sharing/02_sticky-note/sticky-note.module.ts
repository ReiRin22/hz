import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { StickyNoteController } from './sticky-note.controller';
import { StickyNoteService } from './sticky-note.service';
import { StickyNoteClient } from './sticky-note.client';

@Module({
  imports: [HttpModule],
  controllers: [StickyNoteController],
  providers: [StickyNoteService, StickyNoteClient],
})
export class StickyNoteModule {}
