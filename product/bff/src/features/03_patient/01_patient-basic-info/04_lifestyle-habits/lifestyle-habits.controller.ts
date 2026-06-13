import { Controller } from '@nestjs/common';
import { LifestyleHabitsService } from './lifestyle-habits.service';

@Controller('lifestyle-habits')
export class LifestyleHabitsController {
  constructor(private readonly lifestyleHabitsService: LifestyleHabitsService) {}

  // TODO: エンドポイントを実装
}
