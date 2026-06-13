import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OutpatientNursingController } from './outpatient-nursing.controller';
import { OutpatientNursingService } from './outpatient-nursing.service';
import { OutpatientNursingClient } from './outpatient-nursing.client';

@Module({
  imports: [HttpModule],
  controllers: [OutpatientNursingController],
  providers: [OutpatientNursingService, OutpatientNursingClient],
})
export class OutpatientNursingModule {}
