import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { Form1OutpatientController } from './form1-outpatient.controller';
import { Form1OutpatientService } from './form1-outpatient.service';
import { Form1OutpatientClient } from './form1-outpatient.client';

@Module({
  imports: [HttpModule],
  controllers: [Form1OutpatientController],
  providers: [Form1OutpatientService, Form1OutpatientClient],
})
export class Form1OutpatientModule {}
