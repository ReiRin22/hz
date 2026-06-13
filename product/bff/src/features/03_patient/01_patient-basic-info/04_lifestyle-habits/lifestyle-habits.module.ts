import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LifestyleHabitsController } from './lifestyle-habits.controller';
import { LifestyleHabitsService } from './lifestyle-habits.service';
import { LifestyleHabitsClient } from './lifestyle-habits.client';

@Module({
  imports: [HttpModule],
  controllers: [LifestyleHabitsController],
  providers: [LifestyleHabitsService, LifestyleHabitsClient],
})
export class LifestyleHabitsModule {}
