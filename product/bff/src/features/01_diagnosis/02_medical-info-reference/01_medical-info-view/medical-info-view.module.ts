import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MedicalInfoViewController } from './medical-info-view.controller';
import { MedicalInfoViewService } from './medical-info-view.service';
import { MedicalInfoViewClient } from './medical-info-view.client';

@Module({
  imports: [HttpModule],
  controllers: [MedicalInfoViewController],
  providers: [MedicalInfoViewService, MedicalInfoViewClient],
})
export class MedicalInfoViewModule {}
