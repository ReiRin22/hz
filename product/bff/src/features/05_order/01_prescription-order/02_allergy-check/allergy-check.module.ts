import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AllergyCheckController } from './allergy-check.controller';
import { AllergyCheckService } from './allergy-check.service';
import { AllergyCheckClient } from './allergy-check.client';

@Module({
  imports: [HttpModule],
  controllers: [AllergyCheckController],
  providers: [AllergyCheckService, AllergyCheckClient],
})
export class AllergyCheckModule {}
