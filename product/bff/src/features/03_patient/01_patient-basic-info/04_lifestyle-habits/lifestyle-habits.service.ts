import { Injectable } from '@nestjs/common';
import { LifestyleHabitsClient } from './lifestyle-habits.client';

@Injectable()
export class LifestyleHabitsService {
  constructor(private readonly lifestyleHabitsClient: LifestyleHabitsClient) {}

  // TODO: ビジネスロジックを実装
}
