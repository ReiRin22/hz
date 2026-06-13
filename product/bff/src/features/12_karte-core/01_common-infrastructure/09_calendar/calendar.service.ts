import { Injectable } from '@nestjs/common';
import { CalendarClient } from './calendar.client';

@Injectable()
export class CalendarService {
  constructor(private readonly calendarClient: CalendarClient) {}

  // TODO: ビジネスロジックを実装
}
