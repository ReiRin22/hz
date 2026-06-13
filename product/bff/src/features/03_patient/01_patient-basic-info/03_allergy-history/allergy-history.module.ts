import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AllergyHistoryController } from './allergy-history.controller';
import { AllergyHistoryService } from './allergy-history.service';
import { AllergyHistoryClient } from './allergy-history.client';

@Module({
  imports: [HttpModule],
  controllers: [AllergyHistoryController],
  providers: [AllergyHistoryService, AllergyHistoryClient],
})
export class AllergyHistoryModule {}
