import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { CalendarClient } from './calendar.client';

@Module({
  imports: [HttpModule],
  controllers: [CalendarController],
  providers: [CalendarService, CalendarClient],
})
export class CalendarModule {}
