import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MealFormMgmtController } from './meal-form-mgmt.controller';
import { MealFormMgmtService } from './meal-form-mgmt.service';
import { MealFormMgmtClient } from './meal-form-mgmt.client';

@Module({
  imports: [HttpModule],
  controllers: [MealFormMgmtController],
  providers: [MealFormMgmtService, MealFormMgmtClient],
})
export class MealFormMgmtModule {}
