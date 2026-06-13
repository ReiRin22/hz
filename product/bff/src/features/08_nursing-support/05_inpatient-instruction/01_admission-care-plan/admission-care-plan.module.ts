import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AdmissionCarePlanController } from './admission-care-plan.controller';
import { AdmissionCarePlanService } from './admission-care-plan.service';
import { AdmissionCarePlanClient } from './admission-care-plan.client';

@Module({
  imports: [HttpModule],
  controllers: [AdmissionCarePlanController],
  providers: [AdmissionCarePlanService, AdmissionCarePlanClient],
})
export class AdmissionCarePlanModule {}
